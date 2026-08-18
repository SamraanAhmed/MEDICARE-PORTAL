import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-medicare text-slate-800 font-body selection:bg-teal-700 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow animate-in fade-in duration-300">
        {children}
      </main>

      {/* Footnote and contact blocks */}
      <Footer />
    </div>
  );
};

export default Layout;
