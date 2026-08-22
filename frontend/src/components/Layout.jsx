import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-medicare text-slate-800 font-body selection:bg-teal-700 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Area — pt-20 offsets the fixed navbar height */}
      <main className="flex-grow animate-in fade-in duration-300 pt-20">
        {children}
      </main>

      {/* Footnote and contact blocks */}
      <Footer />
    </div>
  );
};

export default Layout;
