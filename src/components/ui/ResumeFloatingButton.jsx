import { motion } from 'framer-motion';
import ResumeDownloadButton from './ResumeDownloadButton.jsx';

export default function ResumeFloatingButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="fixed bottom-5 left-5 z-30 hidden sm:block"
    >
      <ResumeDownloadButton
        label="Resume"
        placement="floating"
        compact
        pulseOnLoad={false}
      />
    </motion.div>
  );
}
