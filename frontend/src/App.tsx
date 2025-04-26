import { useEffect, useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import JobDescInput from './components/JobDescInput';
import LlamaScorePanel from './components/LlamaScorePanel';
import LatexUpload from './components/LatexUpload';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm px-3 py-1.5 rounded-md shadow hover:scale-105 transition"
    >
      {dark ? '☀ Light' : '🌙 Dark'}
    </button>
  );
};

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobdesc, setJobdesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
        <ThemeToggle />
        <NavBar />

        {/* Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 960"
          >
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9">
                  <animate attributeName="stop-color" values="#0ea5e9;#6366f1;#0ea5e9" dur="12s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#10b981">
                  <animate attributeName="stop-color" values="#10b981;#4f46e5;#10b981" dur="12s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" />
          </svg>
          <div className="absolute inset-0 bg-white/50 dark:bg-black/40 backdrop-blur-sm"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 space-y-10">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="text-center">
                    <h1 className="text-5xl font-bold text-primary drop-shadow-xl">Resume Genius</h1>
                    <p className="text-gray-700 dark:text-gray-300 text-md mt-2 font-medium">
                      Optimize your resume with AI-powered LLaMA scoring
                    </p>
                  </div>

                  <ResumeUpload
                    onResumeParsed={setResumeText}
                    uploading={uploading}
                    setUploading={setUploading}
                    setUploadMsg={setUploadMsg}
                    uploadMsg={uploadMsg}
                  />

                  <JobDescInput jobdesc={jobdesc} setJobdesc={setJobdesc} />

                  <LlamaScorePanel resumeText={resumeText} jobdesc={jobdesc} />
                </>
              }
            />
            <Route path="/latex" element={<LatexUpload />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
