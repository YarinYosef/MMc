'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';
import { cn } from '@/lib/utils';

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const MAX_RATINGS_PER_DAY = 3;

interface RatingEntry {
  value: number;
  timestamp: number;
}

interface RatingData {
  entries: RatingEntry[];
  runningAverage: number;
  totalCount: number;
}

function loadRatingData(): RatingData {
  const saved = loadFromStorage<RatingData>('importance-ratings');
  return saved ?? { entries: [], runningAverage: 0, totalCount: 0 };
}

function saveRatingData(data: RatingData) {
  saveToStorage('importance-ratings', data);
}

function getRatingsToday(data: RatingData): number {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const cutoff = dayStart.getTime();
  return data.entries.filter((e) => e.timestamp >= cutoff).length;
}

export function RatingOverlay() {
  const { ratingOverlayOpen, toggleRatingOverlay } = useLayoutStore();
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const ratingData = useMemo(() => loadRatingData(), [ratingOverlayOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const ratingsToday = getRatingsToday(ratingData);
  const limitReached = ratingsToday >= MAX_RATINGS_PER_DAY;

  const handleSubmit = () => {
    if (rating === null || limitReached) return;

    const newEntry: RatingEntry = { value: rating, timestamp: Date.now() };
    const updatedEntries = [...ratingData.entries, newEntry];
    const newTotalCount = ratingData.totalCount + 1;
    const newAverage =
      (ratingData.runningAverage * ratingData.totalCount + rating) / newTotalCount;

    saveRatingData({
      entries: updatedEntries,
      runningAverage: Math.round(newAverage * 100) / 100,
      totalCount: newTotalCount,
    });

    setSubmitted(true);
    setTimeout(() => {
      toggleRatingOverlay();
      setRating(null);
      setSubmitted(false);
    }, 1200);
  };

  const handleClose = () => {
    toggleRatingOverlay();
    setRating(null);
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      {ratingOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-[#131313] border border-black rounded-xl shadow-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">&#10003;</div>
                <div className="text-sm text-white">Thanks for your rating!</div>
                <div className="text-xs text-[#999999] mt-1">
                  Rating: {rating}/10 | Running avg: {loadRatingData().runningAverage.toFixed(1)}
                </div>
              </div>
            ) : limitReached ? (
              <div className="text-center py-4">
                <div className="text-sm text-white mb-2">Daily limit reached</div>
                <div className="text-xs text-[#999999]">
                  Max {MAX_RATINGS_PER_DAY} ratings per 24 hours ({ratingsToday}/{MAX_RATINGS_PER_DAY} used)
                </div>
                {ratingData.totalCount > 0 && (
                  <div className="text-xs text-[#999999] mt-2">
                    Running average: {ratingData.runningAverage.toFixed(1)}/10 ({ratingData.totalCount} total ratings)
                  </div>
                )}
                <button
                  onClick={handleClose}
                  className="mt-4 px-4 py-1.5 text-xs text-[#999999] rounded border border-black hover:bg-white/[0.06] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-3">
                  <div className="text-sm font-semibold text-white">Rate Importance</div>
                  <div className="text-[10px] text-[#999999] mt-0.5">
                    Shift + Right-click to toggle | {ratingsToday}/{MAX_RATINGS_PER_DAY} today
                  </div>
                </div>

                {/* 1-10 scale */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  {RATINGS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHoveredRating(val)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className={cn(
                        'w-8 h-8 rounded text-xs font-mono font-bold transition-all',
                        val <= (hoveredRating ?? rating ?? 0)
                          ? val <= 3
                            ? 'bg-red-500 text-white scale-105'
                            : val <= 6
                              ? 'bg-amber-500 text-white scale-105'
                              : 'bg-green-500 text-white scale-105'
                          : 'bg-white/[0.06] text-[#999999] hover:bg-white/10'
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Scale labels */}
                <div className="flex justify-between text-[10px] text-[#999999] px-1 mb-3">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>

                {/* Running average */}
                {ratingData.totalCount > 0 && (
                  <div className="text-center text-[10px] text-[#999999] mb-3">
                    Running avg: {ratingData.runningAverage.toFixed(1)}/10 ({ratingData.totalCount} ratings)
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-1.5 text-xs text-[#999999] hover:text-white rounded border border-black hover:bg-white/[0.06] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={rating === null}
                    className={cn(
                      'flex-1 py-1.5 text-xs rounded transition-colors',
                      rating !== null
                        ? 'bg-[#AB9FF2] text-white hover:brightness-110'
                        : 'bg-white/[0.06] text-[#777777] cursor-not-allowed'
                    )}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
