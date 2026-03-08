import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/navbar/Navbar.jsx';
import Hero from './components/hero/Hero.jsx';
import Footer from './components/footer/Footer.jsx';
import ShimmerSkeleton from './components/ui/ShimmerSkeleton.jsx';
import ChatErrorBoundary from './components/ai/ChatErrorBoundary.jsx';
import { useSectionReveal } from './hooks/useSectionReveal.js';
import { useParallax } from './hooks/useParallax.js';
import { useTrackPageView, useTrackSectionEngagement } from './hooks/useAnalytics.js';

const About = lazy(() => import('./components/about/About.jsx'));
const ProjectGrid = lazy(() => import('./components/projects/ProjectGrid.jsx'));
const Skills = lazy(() => import('./components/skills/Skills.jsx'));
const Timeline = lazy(() => import('./components/experience/Timeline.jsx'));
const ContactForm = lazy(() => import('./components/contact/ContactForm.jsx'));
const ChatAssistant = lazy(() => import('./components/ai/ChatAssistant.jsx'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage.jsx'));

function SectionSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ShimmerSkeleton className="h-44" />
      <ShimmerSkeleton className="h-44" />
      <ShimmerSkeleton className="h-44 sm:col-span-2 lg:col-span-1" />
    </div>
  );
}

function RevealSection({ id, className = '', children }) {
  const reveal = useSectionReveal({ once: true, amount: 0.22 });
  return (
    <motion.section
      id={id}
      ref={reveal.ref}
      className={`section-padding ${className}`}
      variants={reveal.variants}
      initial="hidden"
      animate={reveal.controls}
    >
      <div className="section-container">{children}</div>
    </motion.section>
  );
}

function HomePage() {
  const parallaxY = useParallax(110);
  useTrackPageView('portfolio-home');
  useTrackSectionEngagement(['home', 'about', 'projects', 'skills', 'experience', 'contact']);

  return (
    <motion.div
      className="theme-page relative min-h-screen overflow-hidden transition-colors duration-500"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="theme-orb-primary pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ y: parallaxY }}
      />
      <motion.div
        className="theme-orb-secondary pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
        style={{ y: parallaxY }}
      />

      <Navbar />
      <main className="relative space-y-0 pt-20">
        <section id="home" className="section-padding">
          <div className="section-container">
            <Hero />
          </div>
        </section>

        <RevealSection id="about" className="theme-section-alt">
          <Suspense fallback={<SectionSkeleton />}>
            <About />
          </Suspense>
        </RevealSection>

        <RevealSection id="projects">
          <Suspense fallback={<SectionSkeleton />}>
            <ProjectGrid />
          </Suspense>
        </RevealSection>

        <RevealSection id="skills" className="theme-section-alt">
          <Suspense fallback={<SectionSkeleton />}>
            <Skills />
          </Suspense>
        </RevealSection>

        <RevealSection id="experience">
          <Suspense fallback={<SectionSkeleton />}>
            <Timeline />
          </Suspense>
        </RevealSection>

        <RevealSection id="contact" className="theme-section-alt">
          <Suspense fallback={<SectionSkeleton />}>
            <ContactForm />
          </Suspense>
        </RevealSection>
      </main>

      <ChatErrorBoundary>
        <Suspense fallback={null}>
          <ChatAssistant />
        </Suspense>
      </ChatErrorBoundary>
      <Footer />
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
