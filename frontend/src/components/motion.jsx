import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export const EASE = [0.22, 1, 0.36, 1];

export function PageWrap({ children, className = '', ...rest }) {
  return (
    <motion.main
      className={className}
      {...rest}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.main>
  );
}

export function Reveal({ children, delay = 0, y = 28, className = '', once = true, ...rest }) {
  return (
    <motion.div
      className={className}
      {...rest}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '', gap = 0.08, ...rest }) {
  return (
    <motion.div
      className={className}
      {...rest}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function MaskReveal({ lines, className = '', lineClassName = '', delay = 0 }) {
  return (
    <div className={className}>
      {lines.map((l, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.12, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function CountUp({ to = 0, prefix = '', suffix = '', duration = 1.4, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={`num ${className}`}>
      {prefix}
      {Math.round(val).toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function LiveNumber({ value, prefix = '', className = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(val, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className={`num ${className}`}>
      {prefix}
      {Math.round(val).toLocaleString('en-IN')}
    </span>
  );
}
