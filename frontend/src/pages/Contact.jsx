import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MapEmbed from '../components/MapEmbed';
import { Phone, Mail, MapPin, Send, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(4, { message: 'Subject must be at least 4 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const containerRef = useRef(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    // Simulate API lead generation call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact lead captured: ", data);
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 5000);
  };

  useGSAP(() => {
    // Header Animation
    gsap.from('.contact-header', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Left Column Info Cards ScrollTrigger
    gsap.from('.contact-info-card', {
      scrollTrigger: {
        trigger: '.contact-info-card',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Stagger Info Items
    gsap.from('.info-item', {
      scrollTrigger: {
        trigger: '.contact-info-card',
        start: 'top 80%'
      },
      opacity: 0,
      y: 15,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    });

    // Map Embed ScrollTrigger
    gsap.from('.contact-map', {
      scrollTrigger: {
        trigger: '.contact-map',
        start: 'top 85%'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Form Container ScrollTrigger
    gsap.from('.contact-form-card', {
      scrollTrigger: {
        trigger: '.contact-form-card',
        start: 'top 85%'
      },
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Form elements inside card
    gsap.from('.form-el', {
      scrollTrigger: {
        trigger: '.contact-form-card',
        start: 'top 75%'
      },
      opacity: 0,
      y: 15,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="contact-header text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-teal-950 font-heading">Contact Our Medical Office</h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Have an inquiry, feedback, or need administrative assistance? Reach out to our front desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Coordinates and Map */}
        <div className="lg:col-span-5 space-y-8 text-left">
          
          {/* Quick info cards */}
          <div className="contact-info-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-teal-950 font-heading border-b border-slate-50 pb-3">Get in Touch</h3>
            
            <div className="info-item flex items-start gap-4">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-2xl border border-teal-100 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-heading">Call Center</h4>
                <p className="text-sm text-slate-600 mt-1">+92 (51) 111-844-844</p>
                <p className="text-xs text-slate-400">Campus Exchange: +92 (51) 844-6666</p>
              </div>
            </div>

            <div className="info-item flex items-start gap-4">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-2xl border border-teal-100 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-heading">Email Address</h4>
                <p className="text-sm text-slate-600 mt-1">support@medicare-portal.com</p>
                <p className="text-xs text-slate-400">Response time: within 24 hours</p>
              </div>
            </div>

            <div className="info-item flex items-start gap-4">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-2xl border border-teal-100 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-heading">Main Campus</h4>
                <p className="text-sm text-slate-600 mt-1">Ibadat International University, Islamabad, Pakistan</p>
                <p className="text-xs text-slate-400">Japan Road, Sihala, Islamabad</p>
              </div>
            </div>
          </div>

          {/* Interactive OSM Map */}
          <div className="contact-map space-y-3">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider pl-1">Hospital Location</h4>
            <MapEmbed />
          </div>

        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="contact-form-card lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-md text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full -z-10"></div>
          
          <h3 className="form-el text-2xl font-bold text-teal-950 font-heading">Submit an Inquiry</h3>
          <p className="form-el text-slate-500 text-xs mt-1 leading-relaxed">
            Fill out the form below and our medical coordinators will route your request to the correct department.
          </p>

          {/* Success Banner */}
          {success && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Inquiry Sent Successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Thank you for writing. We will get back to you shortly.</p>
              </div>
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="form-el grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:outline-hidden text-sm transition-all focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                    errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-rose-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:outline-hidden text-sm transition-all focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                    errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-rose-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

            </div>

            {/* Subject */}
            <div className="form-el space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                placeholder="Billing query / Administrative support"
                {...register('subject')}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:outline-hidden text-sm transition-all focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                  errors.subject ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.subject && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="form-el space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Message</label>
              <textarea
                rows="5"
                placeholder="Please detail your request here..."
                {...register('message')}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:outline-hidden text-sm transition-all focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                  errors.message ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              ></textarea>
              {errors.message && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-el pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
              >
                {isSubmitting ? 'Sending inquiry...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Contact;
