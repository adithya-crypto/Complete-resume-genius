import { motion } from 'framer-motion';

interface JobDescInputProps {
  jobdesc: string;
  setJobdesc: (text: string) => void;
}

const JobDescInput = ({ jobdesc, setJobdesc }: JobDescInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-4"
    >
      <textarea
        className="w-full min-h-[150px] p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent text-sm font-medium resize-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        placeholder="Paste the job description here..."
        value={jobdesc}
        onChange={(e) => setJobdesc(e.target.value)}
      />
    </motion.div>
  );
};

export default JobDescInput;
