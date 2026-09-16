import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Toaster } from '@/components/ui/sonner';
import '@/App.css';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Verify from './pages/Verify';
import Requirements from './pages/Requirements';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import WhyScheme from './pages/WhyScheme';
import Eligibility from './pages/Eligibility';
import Documents from './pages/Documents';
import Calculator from './pages/Calculator';
import Applications from './pages/Applications';
import Connect from './pages/Connect';
import Voice from './pages/Voice';
import Grow from './pages/Grow';
import Stories from './pages/Stories';

function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />
        <Route path="/schemes/:id/why" element={<WhyScheme />} />
        <Route path="/schemes/:id/eligibility" element={<Eligibility />} />
        <Route path="/schemes/:id/documents" element={<Documents />} />
        <Route path="/schemes/:id/calculator" element={<Calculator />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/grow" element={<Grow />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  useLenis();
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Shell />
      </AppProvider>
    </BrowserRouter>
  );
}
