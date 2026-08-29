import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingChatbot from './FloatingChatbot';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useGSAP(() => {
    // Refresh ScrollTrigger when the route changes to ensure animations work correctly
    ScrollTrigger.refresh();
    
    // Select all heading+para containers with the class .section-header-anim
    const headers = gsap.utils.toArray('.section-header-anim');
    
    headers.forEach((header) => {
      gsap.from(header, {
        y: -40, // Slide down from the top
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Select and animate left-side elements
    gsap.utils.toArray('.slide-in-left').forEach((el) => {
      gsap.from(el, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Select and animate right-side elements
    gsap.utils.toArray('.slide-in-right').forEach((el) => {
      gsap.from(el, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Select and stagger cards inside a container
    gsap.utils.toArray('.stagger-cards-container').forEach((container) => {
      gsap.from(container.querySelectorAll('.stagger-card'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Select and fade up single elements
    gsap.utils.toArray('.fade-up-anim').forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, [pathname, children]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-medicare text-slate-800 font-body selection:bg-teal-700 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow animate-in fade-in duration-300">
        {children}
      </main>

      {/* Floating AI Chatbot */}
      <FloatingChatbot />

      {/* Footnote and contact blocks */}
      <Footer />
    </div>
  );
};

export default Layout;
