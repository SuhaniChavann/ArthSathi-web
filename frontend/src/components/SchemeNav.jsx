import { Link, useParams, useLocation } from 'react-router-dom';
import { SCHEMES } from '../data/mock';

const TABS = [
  { p: '', label: 'Overview' },
  { p: '/why', label: 'Why this scheme' },
  { p: '/eligibility', label: 'Eligibility' },
  { p: '/documents', label: 'Documents' },
  { p: '/calculator', label: 'Calculator' },
];

export function useScheme() {
  const { id } = useParams();
  return SCHEMES.find((s) => s.id === id) || SCHEMES[0];
}

export function SchemeNav() {
  const scheme = useScheme();
  const loc = useLocation();
  return (
    <div className="container-x mt-6">
      <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-white p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-testid="scheme-subnav">
        {TABS.map((t) => {
          const to = `/schemes/${scheme.id}${t.p}`;
          const active = loc.pathname === to;
          return (
            <Link
              key={t.p}
              to={to}
              data-testid={`subnav-${t.label.toLowerCase().replace(/\s/g, '-')}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${active ? 'bg-pine text-white' : 'text-sage hover:bg-pine/5 hover:text-ink'}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
