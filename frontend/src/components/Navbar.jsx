import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, MessageSquare, Phone, User, LayoutDashboard, LogOut, ChevronDown, Activity } from 'lucide-react';

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
    { name: 'Home', path: '/' },
    { name: 'Book Appointment', path: '/book', icon: Calendar },
    { name: 'AI Health Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/imgvid/medicarelogo.png" 
                alt="MediCare Logo" 
                className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500 bg-white transition-transform group-hover:scale-105 duration-300 shadow-xs shrink-0"
              />
              <span className="text-2xl font-bold tracking-tight text-teal-800 flex items-center gap-1 font-heading">
                Medi<span className="text-emerald-500">Care</span>
              </span>
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
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-teal-800 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md py-4 px-4 space-y-3 animate-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-teal-50 text-teal-800 font-bold'
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
                className="w-full py-3 bg-teal-800 text-white rounded-xl font-semibold hover:bg-teal-900 transition-colors flex items-center justify-center gap-2"
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
