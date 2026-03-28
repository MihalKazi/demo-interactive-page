'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Trigger { id: number; trigger: number; text: string }

interface ScrollyBlockProps {
  mainText: string;
  animationTriggers: Trigger[];
}

export const ScrollyBlock = ({ mainText, animationTriggers }: ScrollyBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll gives us a 'progress' value from 0 (top of viewport) to 1 (bottom of viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] // ["elementTop viewportBottom", "elementBottom viewportTop"]
  });

  return (
    <div ref={containerRef} className="my-20 p-8 bg-gray-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 relative overflow-hidden min-h-[50vh]">
      
      {/* Narrative Section - Stays Fixed */}
      <div className="flex-1 sticky top-32 h-min">
        <h3 className="text-3xl font-extrabold leading-tight mb-6 text-blue-300">
          Scaling Surveillance
        </h3>
        <p className="text-xl text-gray-100 leading-relaxed font-serif">
          {mainText}
        </p>
      </div>

      {/* Triggered Updates Section */}
      <div className="flex-1 relative md:pt-16 space-y-32">
        {animationTriggers.map((point) => (
          <ScrollTriggeredItem 
            key={point.id} 
            progress={scrollYProgress} 
            trigger={point.trigger}
            text={point.text}
          />
        ))}
      </div>
    </div>
  );
};

// Component for a single animated point
const ScrollTriggeredItem = ({ progress, trigger, text }: { progress: any; trigger: number; text: string }) => {
  // Translate progress (0->1) into an animation state (0->1 opacity) starting at the trigger point
  // We fade in when progress > trigger and fade out shortly after.
  const opacity = useTransform(
    progress,
    [trigger - 0.1, trigger, trigger + 0.1, trigger + 0.2], // Input: 10% before trigger, at trigger, 10% after...
    [0, 1, 1, 0] // Output Opacity: 0, 1 (fully visible), 1 (fully visible), 0
  );

  return (
    <motion.div 
      style={{ opacity }}
      className="bg-blue-600/30 border border-blue-500/50 p-6 rounded-xl flex items-center gap-4 shadow-inner"
    >
        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-3xl font-bold">!</span>
        <p className="text-lg font-medium text-white flex-1">{text}</p>
    </motion.div>
  );
}