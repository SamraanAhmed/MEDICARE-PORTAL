import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { Menu, X, Calendar, MessageSquare, Phone, User, LayoutDashboard, LogOut, ChevronDown, Activity } from 'lucide-react';
import navLogo from '../assets/nav logo.png';

=======
import { Menu, X, Calendar, Phone, User, LayoutDashboard, LogOut, Home, ArrowRight, ChevronDown, Info } from 'lucide-react';
>>>>>>> a572ace25d9323f319ecd108f9ceb1ba0e0c2c54

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

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  return (
<<<<<<< HEAD
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center group ml-9">
              <img 
                src={navLogo} 
                alt="MediCare" 
                className="h-[68px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 text-sm font-medium transition-colors hover:text-teal-800 ${
                    isActive(link.path) ? 'text-teal-800 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Auth Buttons or Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-emerald-500 object-cover"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-3">{user.name}</p>
                    <span className="text-[10px] text-emerald-600 capitalize font-medium">{role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <span className="inline-block bg-teal-50 text-[10px] text-teal-800 font-semibold px-2 py-0.5 rounded-full mt-1 capitalize">
                        {role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2.5 bg-teal-800 text-white rounded-full font-semibold hover:bg-teal-900 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
=======
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
>>>>>>> a572ace25d9323f319ecd108f9ceb1ba0e0c2c54
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
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-emerald-500 object-cover shrink-0"
                    />
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
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        My Dashboard
                      </Link>

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
                        to="/auth"
                        className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-xs"
                      >
                        <User className="w-3.5 h-3.5" />
                        Sign In
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
          {navLinks.map((link) => {
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
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-emerald-500 object-cover"
              />
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
