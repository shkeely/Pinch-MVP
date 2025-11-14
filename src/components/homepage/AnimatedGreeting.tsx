import React from "react";

interface AnimatedGreetingProps {
  userName: string;
  status: 'all-clear' | 'normal' | 'needs-attention';
}

export default function AnimatedGreeting({ userName, status }: AnimatedGreetingProps) {
  const getStatusMessage = () => {
    switch (status) {
      case 'all-clear':
        return "Everything is running smoothly ✨";
      case 'normal':
        return "Here are today's updates";
      case 'needs-attention':
        return "Here are today's updates";
      default:
        return "Here are today's updates";
    }
  };

  return (
    <div className="py-8 animate-fade-in text-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2">
        Hello {userName},
      </h1>
      <p className="text-xl md:text-2xl text-black">
        {getStatusMessage()}
      </p>
    </div>
  );
}
