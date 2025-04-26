import { useState } from 'react';

export default function ATSScorePanel() {
  const [resumeText, setResumeText] = useState('');
  const [jobdesc, setJobdesc] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.pdf')) {
      setUploadMsg('❌ Please upload a valid PDF resume');
      return;
    }

    setUploadMsg('Parsing resume...');
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('http://localhost:5050/upload/resume', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResumeText(data.text || '');
    setUploadMsg('✅ Resume uploaded and parsed');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setScore(null);
    setKeywords([]);

    const res = await fetch('http://localhost:5050/score-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: resumeText, jobdesc }),
    });

    const data = await res.json();
    setScore(data.score);
    setKeywords(data.matchedKeywords);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center">📄 ATS Score Checker</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Upload Resume (.pdf)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="bg-gray-100 dark:bg-gray-900 border p-2 rounded"
        />
        {uploadMsg && <p className="text-sm text-green-600">{uploadMsg}</p>}
      </div>

      <textarea
        value={jobdesc}
        onChange={(e) => setJobdesc(e.target.value)}
        placeholder="Paste job description here..."
        rows={6}
        className="w-full rounded-lg p-3 border border-gray-300 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-900"
      />

      <button
        onClick={handleAnalyze}
        className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
        disabled={loading || !resumeText || !jobdesc}
      >
        {loading ? 'Scoring...' : 'Check ATS Match'}
      </button>

      {score !== null && (
        <div className="text-center space-y-3">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-full h-full transform rotate-[-90deg]">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="gray"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#0ea5e9"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
              {score}%
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Matched Keywords:</strong> {keywords.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
