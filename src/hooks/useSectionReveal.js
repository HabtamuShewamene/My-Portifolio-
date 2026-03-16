import { useAnimationControls, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function useSectionReveal({ once = true, amount = 0.2 } = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      controls.set('visible');
      return;
    }
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once, reducedMotion]);

  return {
    sectionRef: ref,
    controls,
    variants: {
      hidden: { opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)' },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      },
    },
  };
}
