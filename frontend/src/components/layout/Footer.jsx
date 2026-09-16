import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck } from 'lucide-react';
import { ExtBadge } from '../widgets';

export default function Footer() {
  return (
    <footer className="mt-24 bg-pine text-sand">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand text-pine"><Sprout size={18} /></span>
            <span className="font-display text-lg font-extrabold">SahaySetu</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand/70">
            A guided journey from “I need support” to “I know what fits, why, what it costs and where to go.”
            We assist, explain, organise and connect — final decisions always rest with the concerned authority.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-sand/50 mb-4">Journey</p>
          <ul className="space-y-2.5 text-sm text-sand/80">
            <li><Link className="hover:text-white" to="/profile">Profile & Verification</Link></li>
            <li><Link className="hover:text-white" to="/schemes">Scheme Recommendations</Link></li>
            <li><Link className="hover:text-white" to="/applications">Bulk Applications</Link></li>
            <li><Link className="hover:text-white" to="/connect">Partners & Mentors</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-sand/50 mb-4">Grow</p>
          <ul className="space-y-2.5 text-sm text-sand/80">
            <li><Link className="hover:text-white" to="/grow">ONDC Pathway</Link></li>
            <li><Link className="hover:text-white" to="/stories">Seller Stories</Link></li>
            <li><Link className="hover:text-white" to="/voice">Voice Assistant</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-sand/50 mb-4">Integrated ecosystems</p>
          <div className="flex flex-wrap gap-2">
            {['DigiLocker', 'Udyam', 'ADPList', 'ONDC'].map((n) => <ExtBadge key={n} name={n} />)}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-sand/60">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            These are external services. SahaySetu guides you to them but does not represent them.
          </p>
        </div>
      </div>
      <div className="border-t border-sand/15">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-sand/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Prototype built for Smart India Hackathon · Problem Statement 09-2</p>
          <p>Recommendations are indicative — never approvals.</p>
        </div>
      </div>
    </footer>
  );
}
