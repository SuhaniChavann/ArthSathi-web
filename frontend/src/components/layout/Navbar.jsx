import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Mic, Sprout } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/schemes', label: 'Schemes' },
  { to: '/applications', label: 'Applications' },
  { to: '/connect', label: 'Connect' },
  { to: '/grow', label: 'Grow' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-border/70 bg-cream/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-sand">
              <Sprout size={18} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[17px] font-extrabold tracking-tight text-ink">SahaySetu</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-sage">Beneficiary Platform</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                data-testid={`nav-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                    isActive ? 'bg-pine text-white' : 'text-sage hover:bg-pine/5 hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/voice')}
              data-testid="nav-voice-btn"
              className="btn-accent !h-10 !px-5 !text-[13px]"
            >
              <Mic size={15} />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              data-testid="nav-menu-toggle"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="border-b border-border bg-cream/95 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="container-x grid gap-1 py-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex h-12 items-center rounded-xl px-4 text-[15px] font-semibold ${
                      isActive ? 'bg-pine text-white' : 'text-ink hover:bg-pine/5'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
