import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LanguageToggle } from "../../context/LanguageContext";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Sermons", path: "/sermons" },
  { name: "Gallery", path: "/gallery" },
  {
    name: "More", children: [
      { name: "Bible Study", path: "/bible-study" },
      { name: "Prayer Request", path: "/prayer-request" },
      { name: "Church Blog", path: "/blog" },
      { name: "Bulletin", path: "/bulletin" },
      { name: "Hebrew Calendar", path: "/hebrew-calendar" },
      { name: "Torah Reading Plan", path: "/torah-reading-plan" },
      { name: "Contact", path: "/contact" },
    ]
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdown(false); }, [location]);
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0038B8] shadow-lg" : "bg-[#0038B8]/95 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Sabbathtarian Church of Elohim" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Sabbathtarian</p>
            <p className="text-white/60 text-xs">Church of Elohim</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => link.children ? (
            <div key={link.name} className="relative">
              <button onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white pb-1 border-b-2 border-transparent hover:border-white/50 transition-all">
                {link.name} <ChevronDown size={14} className={`transition-transform ${dropdown ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropdown && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#0038B8]/10 overflow-hidden min-w-[200px]">
                    {link.children.map(child => (
                      <Link key={child.path} to={child.path}
                        className="block px-5 py-3 text-sm text-[#001F6B] hover:bg-[#0038B8] hover:text-white transition-colors font-medium border-b border-gray-50 last:border-0">
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium transition-all pb-1 border-b-2 ${location.pathname === link.path ? "text-white border-white" : "text-white/70 border-transparent hover:text-white hover:border-white/50"}`}>
              {link.name}
            </Link>
          ))}
          {isAdmin && <Link to="/admin" className="text-sm text-white/70 hover:text-white pb-1 border-b-2 border-transparent hover:border-white/50 transition-all">Dashboard</Link>}
          <LanguageToggle />
          {user ? (
            <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full transition-all border border-white/30">Logout</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/register" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full transition-all border border-white/30">Register</Link>
              <Link to="/login" className="bg-white text-[#0038B8] hover:bg-white/90 text-sm font-bold px-5 py-2 rounded-full transition-all shadow-md">Login</Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#001F6B] border-t border-white/10">
            <div className="px-6 py-4 flex flex-col gap-3">
              {["/","/events","/sermons","/gallery","/bible-study","/prayer-request","/blog","/bulletin","/hebrew-calendar","/torah-reading-plan","/contact"].map((path) => {
                const names = { "/": "Home", "/events": "Events", "/sermons": "Sermons", "/gallery": "Gallery", "/bible-study": "Bible Study", "/prayer-request": "Prayer Request", "/blog": "Church Blog", "/bulletin": "Bulletin", "/hebrew-calendar": "Hebrew Calendar", "/torah-reading-plan": "Torah Reading Plan", "/contact": "Contact" };
                return <Link key={path} to={path} className={`text-sm py-2 border-b border-white/10 ${location.pathname === path ? "text-white font-bold" : "text-white/70"}`}>{names[path]}</Link>;
              })}
              {isAdmin && <Link to="/admin" className="text-white/70 text-sm py-2">Dashboard</Link>}
              <LanguageToggle />
              {user ? (
                <button onClick={handleLogout} className="text-white/70 text-sm py-2 text-left">Logout</button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/register" className="border border-white/30 text-white text-sm font-bold px-4 py-2 rounded-full text-center">Register</Link>
                  <Link to="/login" className="bg-white text-[#0038B8] text-sm font-bold px-4 py-2 rounded-full text-center">Login</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
