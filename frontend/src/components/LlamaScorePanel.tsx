import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface LlamaResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export default function LlamaScorePanel({ resumeText, jobdesc }: { resumeText: string; jobdesc: string }) {
  const [llamaResult, setLlamaResult] = useState<LlamaResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setLlamaResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/score-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jobdesc }),
      });

      const data = await res.json();
      setLlamaResult(data);
    } catch (err) {
      console.error('Scoring error:', err);
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-6"
    >
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          className="bg-primary text-white px-6 py-2 rounded-xl text-lg font-semibold shadow hover:scale-105 transition-all"
          disabled={loading || !resumeText || !jobdesc}
        >
          {loading ? 'Scoring...' : 'Get Score'}
        </button>
      </div>

      {llamaResult && (
        <div className="space-y-8">
          {/* Final Score Ring */}
          <div className="flex justify-center">
            <div className="w-40 h-40">
              <CircularProgressbar
                value={llamaResult.score}
                text={`${llamaResult.score}%`}
                styles={buildStyles({
                  textColor: '#10b981',
                  pathColor: '#10b981',
                  trailColor: '#d1fae5',
                  textSize: '18px',
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">💪 Strengths</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                {llamaResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">🛠 Weaknesses</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                {llamaResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">💡 Suggestions</h3>
            <ul className="text-sm list-disc list-inside space-y-1">
              {llamaResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Skill Match */}
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🎯 Skill Matching</h3>
            <p className="text-sm">
              <strong>✅ Matched:</strong> {llamaResult.matchedSkills.length > 0 ? llamaResult.matchedSkills.join(', ') : 'None'}
            </p>
            <p className="text-sm mt-1">
              <strong>❌ Missing:</strong> {llamaResult.missingSkills.join(', ')}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
