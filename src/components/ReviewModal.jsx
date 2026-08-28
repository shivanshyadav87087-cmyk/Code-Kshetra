import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, X, Sparkles, CheckCircle2, User, Award } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import { Button } from './ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

export default function ReviewModal({ isOpen, onClose, player }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalCount, setTotalCount] = useState(0);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState(player?.name || '');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      if (player?.name) setUsername(player.name);
    }
  }, [isOpen, player]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`);
      const data = await res.json();
      if (data && data.reviews) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating || 5.0);
        setTotalCount(data.totalCount || data.reviews.length);
      }
    } catch (e) {
      console.warn('Review fetch warning:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!comment.trim()) {
      setErrorMsg('Please enter a review comment.');
      sounds.playFail();
      return;
    }

    setSubmitting(true);
    sounds.playClick();

    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() || player?.name || 'Coder',
          rating,
          comment: comment.trim(),
          role: player?.email ? 'Verified Coder ⚔️' : 'Competitive Coder ⚔️',
          avatarUrl: player?.avatarUrl || ''
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review.');

      sounds.playSubmitSuccess();
      setSuccessMsg(data.message || 'Review submitted successfully!');
      setComment('');
      fetchReviews();
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting review.');
      sounds.playFail();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121827] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="bg-[#0F172A] border-b border-[#1E293B] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                Community Reviews & Ratings
                <span className="bg-[#14B8A6]/20 text-[#14B8A6] text-xs px-2 py-0.5 rounded-full border border-[#14B8A6]/40">
                  ★ {averageRating} / 5.0
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">Read feedback from coders & submit your experience on Code क्षेत्र</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* Write a Review Section */}
          <div className="bg-[#0F172A]/70 border border-[#1E293B] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#14B8A6]" />
              Write Your Review
            </h3>

            {successMsg && (
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#F87171] text-xs p-3 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94A3B8] font-mono">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your feedback about 1v1 duels, compilers, or platform experience..."
                rows={3}
                className="w-full bg-[#0A0B0F] border border-[#1E293B] focus:border-[#14B8A6] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none transition-all"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#64748B] font-mono">Posting as: <strong className="text-[#38BDF8]">{username || 'Coder'}</strong></span>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white text-xs px-5 py-2 font-bold rounded-lg shadow-lg hover:shadow-[#14B8A6]/20 cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>

          {/* Community Reviews List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#94A3B8] uppercase tracking-wider">
              Community Testimonials ({reviews.length})
            </h3>

            {loading ? (
              <div className="text-center py-8 text-xs text-[#64748B] font-mono">
                Loading community reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#64748B]">
                No reviews submitted yet. Be the first to share your feedback!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev, idx) => (
                  <div key={rev._id || idx} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#38BDF8] text-xs font-bold">
                          {rev.username ? rev.username.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#F8FAFC] block">{rev.username}</span>
                          <span className="text-[10px] text-[#64748B]">{rev.role || 'Competitive Coder ⚔️'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
