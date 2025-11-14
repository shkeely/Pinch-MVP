import React, { useState, useEffect, useRef, useMemo } from "react";

interface AnimatedGreetingProps {
  userName: string;
  handledCount: number;
  attentionCount: number;
  announcementsCount: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function AnimatedGreeting({ 
  userName, 
  handledCount, 
  attentionCount, 
  announcementsCount,
  onComplete,
  onSkip
}: AnimatedGreetingProps) {
  const [step, setStep] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const completedRef = useRef(false);

  const dynamicUpdates = useMemo(() => ([
    handledCount > 0 ? `${handledCount} ${handledCount === 1 ? 'person' : 'people'} asked Pinch questions.` : null,
    attentionCount > 0 ? `${attentionCount} ${attentionCount === 1 ? 'thing' : 'things'} need your attention.` : null,
    announcementsCount > 0 ? `You have ${announcementsCount} upcoming guest ${announcementsCount === 1 ? 'announcement' : 'announcements'}` : null,
  ].filter(Boolean) as string[]), [handledCount, attentionCount, announcementsCount]);

  const messages = useMemo<(string | null)[]>(() => ([
    null, // Step 0: Just greeting
    "Everything is running smoothly ✨",
    "Let's get into today's updates",
    ...dynamicUpdates,
    "Here are today's updates", // Final message - stays visible
  ]), [dynamicUpdates]);

  const timings = useMemo<number[]>(() => {
    const baseDurations = [975, 1950, 1950]; // 30% slower
    const dynamicDurations = Array(dynamicUpdates.length).fill(1950); // 30% slower
    return [...baseDurations, ...dynamicDurations, 1560]; // 30% slower
  }, [dynamicUpdates]);

  useEffect(() => {
    if (!onComplete) return; // Skip animation if no callback
    if (skipped) return; // Stop animation if skipped
    
    const isLast = step === messages.length - 1;

    // Fade in subtitle
    const fadeInTimer = window.setTimeout(() => {
      setSubtitleOpacity(1);
    }, 50);

    let nextTimer: number | null = null;

    if (!isLast) {
      // Normal step: fade out and move to next
      nextTimer = window.setTimeout(() => {
        setSubtitleOpacity(0);
        window.setTimeout(() => setStep(prev => prev + 1), 200);
      }, timings[step] ?? 1500);
    } else {
      // Last step: keep visible, call onComplete once, no fade out
      nextTimer = window.setTimeout(() => {
        setSubtitleOpacity(1);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }, timings[step] ?? 1200);
    }

    return () => {
      clearTimeout(fadeInTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [step, messages.length, timings, onComplete, skipped]);

  const displayMessage = onComplete 
    ? (messages[step] ?? null)
    : (attentionCount > 0 ? "Here are today's updates" : "Everything is running smoothly ✨");

  const isAnimating = onComplete && step >= 1 && step < messages.length - 1;

  const handleSkipClick = () => {
    setSkipped(true);
    setStep(messages.length - 1);
    setSubtitleOpacity(1);
    if (onSkip) onSkip();
  };

  return (
    <div className="py-8 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2 animate-fade-in">
        Hello {userName},
      </h1>
      <p 
        className="text-xl md:text-2xl text-foreground transition-opacity duration-200 min-h-[2rem]"
        style={{ opacity: onComplete ? subtitleOpacity : 1 }}
      >
        {displayMessage}
      </p>
      {isAnimating && onSkip && (
        <button
          onClick={handleSkipClick}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 underline-offset-4 hover:underline animate-fade-in"
        >
          Skip intro →
        </button>
      )}
    </div>
  );
}
