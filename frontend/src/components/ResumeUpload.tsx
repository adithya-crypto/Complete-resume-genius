import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import classNames from 'classnames';

interface ResumeUploadProps {
  onResumeParsed: (text: string) => void;
  setUploadMsg: (msg: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  uploadMsg?: string;
}

const ResumeUpload = ({
  onResumeParsed,
  uploading,
  setUploading,
  setUploadMsg,
  uploadMsg,
}: ResumeUploadProps) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      setUploadMsg('');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/resume`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onResumeParsed(data.text || '');
      setUploadMsg('✅ Resume uploaded successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadMsg('❌ Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }, [onResumeParsed, setUploadMsg, setUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
    >
      <div
        {...getRootProps()}
        className={classNames(
          'transition border-2 border-dashed rounded-xl p-6 text-center cursor-pointer',
          isDragActive ? 'border-accent bg-pink-50' : 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          {isDragActive ? 'Drop the file here...' : 'Drag & drop or click to select a PDF'}
        </p>
      </div>

      {uploading && <p className="mt-3 text-primary text-sm">Uploading...</p>}
      {uploadMsg && <p className="mt-2 text-sm text-green-600">{uploadMsg}</p>}
    </motion.div>
  );
};

export default ResumeUpload;
