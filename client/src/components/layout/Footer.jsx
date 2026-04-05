import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import NewsletterSection from "../ui/NewsletterSection";

function StarOfDavid() {
  const cx = 16, cy = 16, r = 10;
  const p1 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  const p2 = Array.from({ length: 3 }, (_, i) => { const a = (i * 120 + 90) * Math.PI / 180; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
  return <svg width="32" height="32" viewBox="0 0 32 32"><polygon points={p1} fill="none" stroke="white" strokeWidth="2"/><polygon points={p2} fill="none" stroke="white" strokeWidth="2"/></svg>;
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", letter: "f" },
  { label: "YouTube", href: "https://youtube.com", letter: "y" },
  { label: "Twitter", href: "https://twitter.com", letter: "t" },
  { label: "Instagram", href: "https://instagram.com", letter: "in" },
];

export default function Footer() {
  return (
    <>
      <NewsletterSection />
      <footer className="bg-[#001F6B] text-white">
        <div className="h-2 bg-[#0038B8]" />
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <StarOfDavid />
              <div>
                <p className="font-bold text-lg">Sabbathtarian Church of Elohim</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              A community devoted to worship, truth, and the sacred observance of the Sabbath as ordained by Elohim.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, letter }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#0038B8] rounded-full flex items-center justify-center transition-all duration-300 text-white text-xs font-bold"
                  title={label}>
                  {letter}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[["Home","/"],["Events","/events"],["Sermons","/sermons"],["Gallery","/gallery"],["Contact","/contact"]].map(([name, path]) => (
                <Link key={path} to={path} className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-4 h-px bg-[#0038B8] group-hover:w-6 transition-all duration-300" />{name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Resources</h4>
            <div className="flex flex-col gap-3">
              {[["Bible Study","/bible-study"],["Prayer Request","/prayer-request"],["Register","/register"],["Admin Login","/login"]].map(([name, path]) => (
                <Link key={path} to={path} className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-4 h-px bg-[#0038B8] group-hover:w-6 transition-all duration-300" />{name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/60 text-sm"><MapPin size={16} className="text-[#4A7FD4] shrink-0" /><span>Nyahururu, Kenya</span></div>
              <div className="flex items-center gap-3 text-white/60 text-sm"><Mail size={16} className="text-[#4A7FD4] shrink-0" /><span>sabbathtarianchurchofelohim@gmail.com</span></div>
              <div className="flex items-center gap-3 text-white/60 text-sm"><Phone size={16} className="text-[#4A7FD4] shrink-0" /><span>+254 722 867 734</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-white/40 text-xs tracking-wider">
          © 2026 SABBATHTARIAN CHURCH OF ELOHIM — ALL RIGHTS RESERVED
        </div>
      </footer>
    </>
  );
}
