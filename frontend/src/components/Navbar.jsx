import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, Phone, User, LayoutDashboard, LogOut, Home, ArrowRight, ChevronDown, Info, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer and dropdown on route change
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Book Appointment', path: '/book', icon: Calendar },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const getNavLinks = () => {
    const links = [...navLinks];
    if (user && role === 'user') {
      links.push({ name: 'Submit Feedback', path: '/feedback', icon: MessageSquare });
    }
    return links;
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  const getInitials = (name, role) => {
    if (role === 'admin') return 'AD';
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#fafffd]/75 backdrop-blur-md border-b border-slate-200/40 shadow-xs' 
          : 'bg-[#fafffd] border-b border-transparent shadow-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 h-20 items-center">
            
            {/* Left: Hamburger Icon */}
            <div className="flex justify-start">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 rounded-full text-slate-650 hover:text-teal-850 hover:bg-slate-50 transition-all focus:outline-hidden cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6.5 h-6.5" />
              </button>
            </div>

            {/* Center: Centered Clean Image Logo */}
            <div className="flex justify-center">
              <Link to="/home" className="flex items-center group">
                <img 
                  src="/imgvid/medicarelogo.png" 
                  alt="MediCare Logo" 
                  className="h-16 w-auto object-contain transition-transform group-hover:scale-105 duration-300 shrink-0"
                />
              </Link>
            </div>

            {/* Right: Account Button */}
            <div className="flex justify-end relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 205)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-205 bg-slate-50/50 hover:bg-slate-100 transition-all cursor-pointer focus:outline-hidden"
                  >
                    <div className="w-8 h-8 rounded-full border border-teal-500 bg-teal-850 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                      {getInitials(user.name, role)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-3">{user.name}</p>
                      <span className="text-[9px] text-teal-700 capitalize font-bold">{role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-405 shrink-0" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-3 duration-205 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-50 text-left">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-805 truncate">{user.name}</p>
                        <span className="inline-block bg-teal-50 text-[10px] text-teal-805 font-bold px-2.5 py-0.5 rounded-full mt-1 capitalize border border-teal-100">
                          {role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-605 hover:bg-teal-50 hover:text-teal-850 transition-colors font-medium text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-405" />
                        My Dashboard
                      </Link>

                      {role === 'user' && (
                        <Link
                          to="/feedback"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-650 hover:bg-teal-50 hover:text-teal-850 transition-colors font-medium text-left"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-405" />
                          Submit Feedback
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-450" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 205)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-205 bg-slate-50/50 hover:bg-slate-100 transition-all cursor-pointer focus:outline-hidden"
                  >
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-3">Guest Account</p>
                      <span className="text-[9px] text-slate-400 font-medium">Not Signed In</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-450 shrink-0" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 animate-in fade-in slide-in-from-top-3 duration-205 z-50">
                      <p className="text-[11px] text-slate-450 px-2 py-1 mb-2 text-left font-medium">Welcome, Guest</p>
                      <Link
                        to="/"
                        className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-xs"
                      >
                        <User className="w-3.5 h-3.5" />
                        Go to Portal
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-out Left Drawer */}
      <div 
        className={`fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl z-55 transform transition-transform duration-300 ease-out flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 flex justify-between items-center border-b border-slate-100">
          <Link to="/home" onClick={() => setDrawerOpen(false)} className="flex items-center">
            <img 
              src="/imgvid/medicarelogo.png" 
              alt="MediCare Logo" 
              className="h-11 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div 
          data-lenis-prevent
          className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
        >
          {getNavLinks().map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold transition-all group ${
                  active
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-850'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {Icon && <Icon className={`w-5 h-5 ${active ? 'text-teal-750' : 'text-slate-400 group-hover:text-teal-650 transition-colors'}`} />}
                  <span>{link.name}</span>
                </div>
                <ArrowRight className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${active ? 'text-teal-700' : 'text-slate-400'}`} />
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer / Account Quick Details */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-teal-500 bg-teal-850 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {getInitials(user.name, role)}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-xs text-teal-600 capitalize font-semibold">{role}</p>
              </div>
            </div>
          ) : (
            <div className="text-left space-y-1">
              <p className="text-xs font-semibold text-slate-400">Medicare Portal Access</p>
              <p className="text-xs text-slate-500 leading-relaxed">Sign in to schedule doctor checkups & access patient records.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
