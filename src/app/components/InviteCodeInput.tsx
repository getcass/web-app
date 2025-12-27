import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';

export function InviteCodeInput() {
  const [copied, setCopied] = useState(false);
  const code = "XXXXXX";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="inline-flex items-center gap-2 bg-white/10 border border-purple-400/50 rounded-lg px-4 py-2 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <code className="text-purple-300 tracking-wider">{code}</code>
      <button
        onClick={handleCopy}
        className="text-white/60 hover:text-white transition-colors p-1"
        aria-label="Copy invite code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </motion.div>
  );
}
