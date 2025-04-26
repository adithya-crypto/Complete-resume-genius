# ResumeGenius

ResumeGenius is a full-stack application that analyzes resumes against job descriptions using LLM-based semantic scoring and keyword matching. It simulates an ATS (Applicant Tracking System) to help users optimize their resumes.

## Features

- Upload and analyze resumes and job descriptions
- Generate ATS-style resume scores
- Detect matched and missing keywords
- Provide improvement suggestions based on AI analysis

## Technologies

- Frontend: React.js, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Express.js
- LLM Service: Python, HuggingFace Transformers
- Deployment: Vercel

## Live Demo

- [https://resumegenius-ui.vercel.app](https://resumegenius-ui.vercel.app)

## Project Structure

```
ResumeGenius/
├── frontend/       # React frontend
├── backend/        # Node.js backend
├── llm-service/    # Python LLM scoring service
```

## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/adithya-crypto/Complete-resume-genius.git
cd Complete-resume-genius
```

Install dependencies:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# LLM Service
cd ../llm-service
pip install -r requirements.txt
```

Start development servers locally:

```bash
# In frontend/
npm run dev

# In backend/
npm start

# In llm-service/
python huggingface_scoring_service.py
```

## Deployment

- Entire application deployed on Vercel: [https://resumegenius-ui.vercel.app](https://resumegenius-ui.vercel.app)
