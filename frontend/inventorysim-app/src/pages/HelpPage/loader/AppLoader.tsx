import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from '@/features/animation/AnimatedLogo';

// This component handles the splash screen and the loading animation.

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        splash.remove();
      }, 500);
    }
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2600); // matches your animation (~2.5s)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#020617',
              zIndex: 9999,
            }}
          >
            <AnimatedLogo />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default AppLoader;
