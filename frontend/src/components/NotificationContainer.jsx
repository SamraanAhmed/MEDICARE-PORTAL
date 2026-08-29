import React, { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import gsap from 'gsap';

const NotificationContainer = () => {
  const { activeNotification, clearNotification } = useNotification();
  const containerRef = useRef(null);
  const islandRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const timelineRef = useRef(null);
  const delayedCallRef = useRef(null);

  useEffect(() => {
    if (!islandRef.current || !textRef.current || !logoRef.current) return;

    // Kill any previous animation
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
      delayedCallRef.current = null;
    }

    if (activeNotification) {
      const island = islandRef.current;
      const text = textRef.current;
      const logo = logoRef.current;

      // Hold duration (default 2500ms)
      const holdDuration = (activeNotification.duration || 2500) / 1000;

      // --- Set initial state: small pill above viewport ---
      gsap.set(island, {
        y: -80,
        width: 52,
        height: 52,
        borderRadius: '26px',
        opacity: 1,
        paddingLeft: 0,
        paddingRight: 0,
      });
      gsap.set(text, {
        opacity: 0,
        maxWidth: 0,
        paddingLeft: 0,
        overflow: 'hidden',
        display: 'block',
      });
      gsap.set(logo, { scale: 0.8, opacity: 1 });

      // --- Build the timeline ---
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Phase 1: Drop in from top (snappy bounce)
      tl.to(island, {
        y: 16,
        duration: 0.35,
        ease: 'back.out(1.4)',
      })

      // Phase 2: Expand the pill — logo shifts left, text space opens
      .to(island, {
        width: 'auto',
        minWidth: 240,
        maxWidth: 420,
        height: 54,
        paddingLeft: 16,
        paddingRight: 22,
        borderRadius: '27px',
        duration: 0.35,
        ease: 'power3.out',
      }, '+=0.08')

      // Phase 3: Text fades in AND expands WITH the pill (synced)
      .to(text, {
        maxWidth: 320,
        paddingLeft: 12,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, '<0.05')

      // Phase 4: Subtle logo settle
      .to(logo, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      }, '<');

      // --- Hold, then reverse out ---
      delayedCallRef.current = gsap.delayedCall(holdDuration, () => {
        const reverseTl = gsap.timeline({
          onComplete: () => clearNotification(),
        });

        // Collapse: text fades first, then pill shrinks and flies up
        reverseTl
          .to(text, {
            opacity: 0,
            maxWidth: 0,
            paddingLeft: 0,
            duration: 0.2,
            ease: 'power2.in',
          })
          .to(island, {
            width: 52,
            minWidth: 52,
            maxWidth: 52,
            height: 52,
            paddingLeft: 0,
            paddingRight: 0,
            borderRadius: '26px',
            duration: 0.25,
            ease: 'power3.in',
          }, '-=0.05')
          .to(island, {
            y: -80,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          }, '-=0.1');
      });

    } else {
      // No notification — ensure hidden
      gsap.set(islandRef.current, { opacity: 0, y: -80 });
      gsap.set(textRef.current, { opacity: 0, maxWidth: 0 });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (delayedCallRef.current) {
        delayedCallRef.current.kill();
      }
    };
  }, [activeNotification, clearNotification]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] flex justify-center pointer-events-none"
    >
      <div
        ref={islandRef}
        className="flex items-center justify-center opacity-0 overflow-hidden"
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: '#000000',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.35)',
        }}
      >
        <img
          ref={logoRef}
          src="/imgvid/medicarelogot.png"
          alt="Medicare Logo"
          className="h-8 w-8 object-contain shrink-0"
        />
        <span
          ref={textRef}
          className="whitespace-nowrap opacity-0"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '-0.01em',
            color: '#fafffd',
            maxWidth: 0,
            overflow: 'hidden',
            display: 'block',
          }}
        >
          {activeNotification?.message}
        </span>
      </div>
    </div>
  );
};

export default NotificationContainer;
