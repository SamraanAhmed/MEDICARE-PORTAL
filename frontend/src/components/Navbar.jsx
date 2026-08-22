import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, MessageSquare, Phone, User, LayoutDashboard, LogOut, ChevronDown, Activity } from 'lucide-react';
import navLogo from '../assets/nav logo.png';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Book Appointment', path: '/book', icon: Calendar },
    { name: 'AI Health Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  // Scroll detection — drives CSS transition, no conditional rendering
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="relative flex items-center justify-between h-20 px-6 lg:px-10">

        {/* Logo — always visible, floats on hero */}
        <Link to="/home" className="flex items-center group z-10">
          <img
            src={navLogo}
            alt="MediCare"
            className="h-[58px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
        </Link>

        {/* Nav links — single always-rendered element, pill bg transitions via CSS */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 ease-in-out ${
              scrolled
                ? 'bg-transparent shadow-none border-transparent'
                : 'bg-white shadow-xl border border-slate-200'
            }`}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-teal-700 text-white shadow-sm'
                      : scrolled
                        ? 'text-slate-700 hover:text-teal-700 hover:bg-slate-100'
                        : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side — Auth / User */}
        <div className="hidden md:flex items-center z-10">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover shadow-md"
                />
                <div className="text-left hidden lg:block">
                  <p className={`text-xs font-bold leading-3 transition-colors duration-300 ${scrolled ? 'text-slate-800' : 'text-slate-700'}`}>{user.name}</p>
                  <span className="text-[10px] text-emerald-600 capitalize font-medium">{role}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${scrolled ? 'text-slate-400' : 'text-slate-500'}`} />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-full font-semibold text-sm hover:bg-teal-800 transition-all shadow-md"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-slate-600 hover:text-teal-800 focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md py-4 px-4 space-y-3 animate-in slide-in-from-top-5 duration-200 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-teal-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {link.name}
              </Link>
            );
          })}

          {user ? (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-emerald-500 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{role}</p>
                </div>
              </div>

              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-base font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                My Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 text-base font-medium text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
