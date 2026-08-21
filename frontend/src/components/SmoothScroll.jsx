import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately on route changes
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    // Connect Lenis RAF loop to GSAP ticker so they stay perfectly in sync
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // Update ScrollTrigger scroll position on Lenis scroll events
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    
    lenisRef.current?.lenis?.on('scroll', handleScroll);

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off('scroll', handleScroll);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      autoRaf={false}
      root
      options={{
        duration: 1.2,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
