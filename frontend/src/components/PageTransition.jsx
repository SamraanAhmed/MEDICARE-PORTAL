import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = () => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAnimatingRef = useRef(false);
  const isFirstMount = useRef(true);
  const pendingPathRef = useRef(null);

  // Intercept all <a> clicks that are internal Link navigations
  useEffect(() => {
    const handleClick = (e) => {
      // Find the closest <a> tag
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only intercept internal routes (starting with /)
      // Skip external links, hash links, and same-page links
      if (!href.startsWith('/')) return;
      if (href === location.pathname) return;
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // Intercept this navigation
      e.preventDefault();
      e.stopPropagation();
      
      pendingPathRef.current = href;
      playEnter(() => {
        navigate(href);
      });
    };

    // Use capture phase to intercept before React Router handles it
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [location.pathname, navigate]);

  // Also intercept programmatic navigations via custom event
  useEffect(() => {
    const handleTransition = (e) => {
      const { to } = e.detail;
      if (isAnimatingRef.current) return;
      if (to === location.pathname) return;

      pendingPathRef.current = to;
      playEnter(() => {
        navigate(to);
      });
    };

    window.addEventListener('page-transition', handleTransition);
    return () => window.removeEventListener('page-transition', handleTransition);
  }, [navigate, location.pathname]);

  // After route changes, play exit animation
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Only play exit if we triggered the transition
    if (isAnimatingRef.current && pendingPathRef.current) {
      pendingPathRef.current = null;
      // Small delay to let new page render
      setTimeout(() => playExit(), 50);
    }
  }, [location.pathname]);

  const playEnter = (onMidpoint) => {
    if (!topRef.current || !bottomRef.current || !logoRef.current) return;
    isAnimatingRef.current = true;

    const top = topRef.current;
    const bottom = bottomRef.current;
    const logo = logoRef.current;

    // Make visible
    top.style.display = 'block';
    bottom.style.display = 'block';
    logo.style.display = 'flex';

    // Initial: 0% height
    gsap.set(top, { height: '0%' });
    gsap.set(bottom, { height: '0%' });
    gsap.set(logo, { opacity: 0, scale: 0.6 });

    const tl = gsap.timeline();

    // Both divs close in simultaneously
    tl.to([top, bottom], {
      height: '50%',
      duration: 0.38,
      ease: 'power3.inOut',
    })
    // Logo pops in
    .to(logo, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: 'back.out(1.6)',
    }, '-=0.08')
    // Brief hold then navigate
    .call(() => {
      if (onMidpoint) onMidpoint();
    }, null, '+=0.12');
  };

  const playExit = () => {
    if (!topRef.current || !bottomRef.current || !logoRef.current) return;

    const top = topRef.current;
    const bottom = bottomRef.current;
    const logo = logoRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        top.style.display = 'none';
        bottom.style.display = 'none';
        logo.style.display = 'none';
      }
    });

    // Logo fades out
    tl.to(logo, {
      opacity: 0,
      scale: 0.7,
      duration: 0.15,
      ease: 'power2.in',
      delay: 0.1,
    })
    // Both divs retract
    .to([top, bottom], {
      height: '0%',
      duration: 0.38,
      ease: 'power3.inOut',
    }, '-=0.05');
  };

  return (
    <>
      {/* Top div: anchored to top, grows downward */}
      <div
        ref={topRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '0%',
          backgroundColor: '#000000',
          zIndex: 9998,
          display: 'none',
        }}
      />
      {/* Bottom div: anchored to bottom, grows upward */}
      <div
        ref={bottomRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '0%',
          backgroundColor: '#000000',
          zIndex: 9998,
          display: 'none',
        }}
      />
      {/* Medicare logo at dead center */}
      <div
        ref={logoRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/imgvid/medicarelogo.png"
          alt="Medicare"
          style={{
            height: '60px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </>
  );
};

export default PageTransition;
