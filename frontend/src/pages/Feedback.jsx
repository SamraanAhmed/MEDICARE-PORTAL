import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, Send, ShieldAlert, Sparkles, HeartHandshake, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState('General');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    { id: 'General', label: 'General Info', icon: Sparkles },
    { id: 'Doctor Care', label: 'Doctor Care', icon: HeartHandshake },
    { id: 'Facilities', label: 'Facilities', icon: MessageSquare },
    { id: 'Support', label: 'Staff Support', icon: CheckCircle2 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Please enter your feedback message.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    // Construct rich feedback details
    const subject = `Feedback - ${category} [Rating: ${rating}/5]`;
    
    try {
      await api.createContactForm(user.name, user.email, subject, message);
      setSuccess(true);
      setMessage('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth gate check
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-805 flex items-center justify-center mx-auto border border-teal-100">
          <ShieldAlert className="w-8 h-8 text-teal-800" />
        </div>
        <h2 className="text-3xl font-black text-teal-950 font-heading">Patient Feedback</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Sharing clinical and facility feedback is restricted to registered patients. Please sign in to verify your account session.
        </p>
        <div className="pt-2">
          <Link
            to="/auth"
            className="px-8 py-3.5 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Access Sign In Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-teal-950 font-heading">Empower Our Care</h1>
        <p className="text-sm text-slate-500 font-body">Your reviews and ratings directly improve our clinical operations and patient support experience.</p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center shadow-xs space-y-6">
          <div className="w-20 h-20 bg-teal-50 border border-teal-100 text-teal-650 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-teal-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 font-heading">Thank You, {user.name}!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-body">
              Your feedback has been logged in our databases. The System Administrators and clinical board will evaluate your review.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Submit Another Review
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-850 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="font-semibold">{errorMsg}</p>
            </div>
          )}

          {/* Autocompleted User Profile Card */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center font-bold font-heading">
                {user.name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-slate-800">{user.name}</h4>
                <p className="text-[10px] text-slate-400">Authenticated Patient • {user.email}</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full uppercase shrink-0">
              Autocompleted Profile
            </span>
          </div>

          {/* Category Choice Cards */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Feedback Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      isSelected 
                        ? 'border-teal-700 bg-teal-50/50 text-teal-850 shadow-xs' 
                        : 'border-slate-105 hover:border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-teal-750' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold font-heading">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Experience Rating</label>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-2xl w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-500 px-3 capitalize">
                {rating === 5 && 'Excellent'}
                {rating === 4 && 'Good'}
                {rating === 3 && 'Average'}
                {rating === 2 && 'Poor'}
                {rating === 1 && 'Terrible'}
              </span>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Review Comments</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your experience with our doctor, medical clinic, staff response, or online booking portal..."
              rows={5}
              maxLength={500}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/20 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-700 shadow-xs resize-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
              <span>Limit comments to constructive reviews.</span>
              <span>{message.length}/500 characters</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-4 bg-teal-850 hover:bg-teal-900 text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <Send className="w-4.5 h-4.5" />
              {isSubmitting ? 'Submitting Review...' : 'Submit Patient Feedback'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default Feedback;
