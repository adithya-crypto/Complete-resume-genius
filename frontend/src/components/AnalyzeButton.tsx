import { useState } from 'react';

interface ScoreResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  realismFlags: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export default function AnalyzeButton() {
  const [resumeText, setResumeText] = useState('');
  const [jobdesc, setJobdesc] = useState('');
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.pdf')) {
      setUploadMsg('❌ Please upload a valid PDF resume');
      return;
    }

    setUploadMsg('⏳ Uploading...');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/resume`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResumeText(data.text || '');
      setUploadMsg('✅ Resume parsed');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadMsg('❌ Upload failed');
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/score-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jobdesc }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Scoring error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center">🧠 HuggingFace ATS Scoring</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Upload Resume (.pdf)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="bg-gray-100 dark:bg-gray-800 border p-2 rounded"
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
        {loading ? 'Scoring...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="space-y-6 pt-4 text-sm">
          <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl">
            <h3 className="text-lg font-semibold">⭐ Final Score</h3>
            <p className="text-3xl font-bold">{result.score}%</p>
          </div>

          <div className="bg-green-100 dark:bg-green-800 p-4 rounded-xl">
            <h3 className="font-semibold mb-1">💪 Strengths</h3>
            <ul className="list-disc list-inside">{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>

          <div className="bg-red-100 dark:bg-red-800 p-4 rounded-xl">
            <h3 className="font-semibold mb-1">🛠 Weaknesses</h3>
            <ul className="list-disc list-inside">{result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>

          <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-xl">
            <h3 className="font-semibold mb-1">💡 Suggestions</h3>
            <ul className="list-disc list-inside">{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-xl">
            <h3 className="font-semibold mb-1">🚩 Realism Flags</h3>
            <ul className="list-disc list-inside">
              {result.realismFlags.length > 0 ? result.realismFlags.map((r, i) => <li key={i}>{r}</li>) : <li>None</li>}
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
            <h3 className="font-semibold mb-1">🎯 Skill Match</h3>
            <p><strong>✅ Matched:</strong> {result.matchedSkills.join(', ') || 'None'}</p>
            <p><strong>❌ Missing:</strong> {result.missingSkills.join(', ') || 'None'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
