import { useState } from 'react';

const LatexUpload = () => {
  const [uploadMsg, setUploadMsg] = useState('');
  const [preview, setPreview] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.tex')) {
      setUploadMsg('❌ Please upload a valid .tex file');
      return;
    }

    const formData = new FormData();
    formData.append('latex', file);

    try {
      setUploadMsg('⏳ Parsing LaTeX...');
      const res = await fetch('http://localhost:5050/upload/latex', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadMsg(data.message || '');
      setPreview(data.text || '');
    } catch (err) {
      console.error('LaTeX parse failed:', err);
      setUploadMsg('❌ Parsing failed');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">📄 LaTeX Resume Parser</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
          Upload a LaTeX `.tex` resume file and preview its readable content.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="file"
          accept=".tex"
          onChange={handleUpload}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded"
        />
        {uploadMsg && <p className="text-sm text-blue-600 dark:text-blue-400">{uploadMsg}</p>}
      </div>

      {preview && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-[400px] border dark:border-gray-700">
          <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{preview}</pre>
        </div>
      )}
    </div>
  );
};

export default LatexUpload;
