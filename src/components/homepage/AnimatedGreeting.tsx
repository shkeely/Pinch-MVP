import React, { useState, useEffect } from "react";

interface AnimatedGreetingProps {
  userName: string;
  handledCount: number;
  attentionCount: number;
  announcementsCount: number;
  onComplete?: () => void;
}

export default function AnimatedGreeting({ 
  userName, 
  handledCount, 
  attentionCount, 
  announcementsCount,
  onComplete 
}: AnimatedGreetingProps) {
  const [step, setStep] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);

  const messages = [
    null, // Step 0: Just greeting
    "Everything is running smoothly ✨",
    "Let's get into today's updates",
    handledCount > 0 ? `${handledCount} ${handledCount === 1 ? 'person' : 'people'} asked Pinch questions.` : null,
    attentionCount > 0 ? `${attentionCount} ${attentionCount === 1 ? 'thing' : 'things'} need your attention.` : null,
    announcementsCount > 0 ? `You have ${announcementsCount} upcoming guest ${announcementsCount === 1 ? 'announcement' : 'announcements'}` : null,
    "Here are today's updates", // Final message before buttons appear
  ].filter(msg => msg !== null || step <= 2); // Keep nulls for first 3 steps

  useEffect(() => {
    if (!onComplete) return; // Skip animation if no callback
    
    const timings = [750, 1500, 1500, 1500, 1500, 1500, 1200]; // Duration for each step (50% slower)
    
    if (step < messages.length) {
      // Fade in subtitle
      const fadeInTimer = setTimeout(() => {
        setSubtitleOpacity(1);
      }, 50);

      // Move to next step
      const nextStepTimer = setTimeout(() => {
        setSubtitleOpacity(0);
        setTimeout(() => {
          setStep(prev => prev + 1);
        }, 200); // Wait for fade out
      }, timings[step]);

      return () => {
        clearTimeout(fadeInTimer);
        clearTimeout(nextStepTimer);
      };
    } else {
      // Animation complete - keep subtitle visible
      setSubtitleOpacity(1);
      onComplete();
    }
  }, [step, messages.length, onComplete]);

  const displayMessage = onComplete 
    ? (step >= messages.length ? "Here are today's updates" : messages[step])
    : (attentionCount > 0 ? "Here are today's updates" : "Everything is running smoothly ✨");

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
    </div>
  );
}
