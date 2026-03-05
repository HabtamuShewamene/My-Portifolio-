import { motion } from 'framer-motion';

export default function FloatingField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  error = '',
  as = 'input',
  rows = 4,
}) {
  const isActive = Boolean(value?.trim());
  const Tag = as;

  return (
    <label htmlFor={id} className="relative block">
      <Tag
        id={id}
        name={name}
        type={as === 'input' ? type : undefined}
        value={value}
        rows={as === 'textarea' ? rows : undefined}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`theme-input peer w-full rounded-xl border px-4 pb-3 pt-6 text-sm outline-none transition ${
          error ? 'border-rose-500/80' : ''
        }`}
      />
      <motion.span
        className={`pointer-events-none absolute left-4 text-xs ${
          error ? 'text-rose-300' : 'theme-text-soft'
        }`}
        animate={
          isActive
            ? { top: 7, scale: 0.92 }
            : { top: 18, scale: 1 }
        }
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {label}
      </motion.span>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 block text-xs text-rose-300"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}
