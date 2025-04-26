import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link to="/" className="text-xl font-bold text-primary drop-shadow-sm">
          🧠 Resume Genius
        </Link>

        <button
          onClick={toggle}
          className="text-gray-800 dark:text-gray-200 text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-6 pb-4"
          >
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={close}
                className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:underline"
              >
                🧠 LLaMA Scoring
              </Link>
              <Link
                to="/latex"
                onClick={close}
                className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:underline"
              >
                🧾 LaTeX Parser
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
