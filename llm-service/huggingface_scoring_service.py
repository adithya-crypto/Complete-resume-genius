# GPT-4 Hybrid Jobscan-Style ATS Scoring Engine (Strict Rescore)
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Strict scoring using matchedSkills only

def apply_jobscan_rules(resume, jd, gpt_result):
    sections = {
        "skills": re.search(r"(?i)(skills|technical skills)[\s\S]{0,600}", resume or ""),
        "experience": re.search(r"(?i)(experience|professional experience)[\s\S]{0,1000}", resume or ""),
        "summary": re.search(r"(?i)(summary|professional summary)[\s\S]{0,400}", resume or ""),
        "education": re.search(r"(?i)(education)[\s\S]{0,400}", resume or "")
    }

    missing_sections = [k for k, v in sections.items() if v is None]
    matched = gpt_result.get("matchedSkills", [])
    missing = gpt_result.get("missingSkills", [])
    total_keywords = len(matched) + len(missing)
    if total_keywords == 0:
        total_keywords = 1  # avoid div by 0

    # Count skills per section manually
    resume_lower = resume.lower()
    skill_hits = {"skills": 0, "experience": 0, "summary": 0, "education": 0}
    for kw in matched:
        for sec in skill_hits:
            sec_block = sections[sec].group().lower() if sections[sec] else ""
            if kw.lower() in sec_block:
                skill_hits[sec] += 1
                break

    # Cap repetition: max 3 occurrences per skill
    capped_hits = min(len(set(matched)), total_keywords)

    # Final score calculation by section
    score = (
        (skill_hits["skills"] / total_keywords) * 40 +
        (skill_hits["experience"] / total_keywords) * 30 +
        (skill_hits["summary"] / total_keywords) * 20 +
        (skill_hits["education"] / total_keywords) * 10
    )

    # Penalties
    if "skills" in missing_sections:
        score -= 25
    if len(resume.splitlines()) > 100:
        score -= 10
    if sections["experience"] and not re.search(r"\n\s*[-\*\u2022]", sections["experience"].group()):
        score -= 5

    # Bonuses
    jd_title = re.search(r"(?i)as a (.+?)\b[.,]", jd or "")
    resume_title = re.search(r"(?i)(Data Analyst|BI Analyst|Software Engineer|.+?)", resume or "")
    if jd_title and resume_title and jd_title.group(1).lower() in resume_title.group(0).lower():
        score += 5
    if any(term in resume.lower() for term in ["south jordan", "utah", "remote", "hybrid"]):
        score += 3

    final_score = max(0, min(100, round(score)))
    gpt_result["score"] = final_score
    gpt_result["penalties"] = missing_sections
        gpt_result["sectionHits"] = skill_hits
    gpt_result["sectionScoreBreakdown"] = {
        "skills": round((skill_hits["skills"] / total_keywords) * 40, 2),
        "experience": round((skill_hits["experience"] / total_keywords) * 30, 2),
        "summary": round((skill_hits["summary"] / total_keywords) * 20, 2),
        "education": round((skill_hits["education"] / total_keywords) * 10, 2)
    }
    return gpt_result


def get_openai_feedback(resume, jd):
    prompt = '''
You are an ATS resume scoring engine designed to simulate Jobscan.io behavior.
Score resumes using:
- 40% Hard Skills Match
- 30% Experience Relevance
- 20% Summary Alignment
- 10% Education Fit
Return output in this format:
{
  "matchedSkills": [...],
  "missingSkills": [...],
  "strengths": [...],
  "weaknesses": [...],
  "suggestions": [...]
}
Resume:
{resume}

Job Description:
{jd}
'''.replace("{resume}", resume).replace("{jd}", jd)

    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1800,
            stop=["}"]
        )
        text = completion.choices[0].message.content + "}"
        print("OpenAI raw:", text[:300])
        json_block = re.search(r'\{.*\}', text, re.DOTALL)
        parsed = json.loads(json_block.group()) if json_block else {}
        return parsed
    except Exception as e:
        print("OpenAI error:", e)
        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "matchedSkills": [],
            "missingSkills": []
        }


@app.route("/score-resume", methods=["POST"])
def score():
    data = request.json
    resume = data.get("resume", "")
    jd = data.get("jobdesc", "")

    if not resume or not jd:
        return jsonify({"error": "Missing input"}), 400

    try:
        feedback = get_openai_feedback(resume, jd)
        final = apply_jobscan_rules(resume, jd, feedback)
        return jsonify(final)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5055)
