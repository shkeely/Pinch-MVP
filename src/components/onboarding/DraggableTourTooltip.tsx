import { useState, useEffect, useCallback, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableTourTooltipProps {
  children: ReactNode;
  isFirstStep?: boolean;
  className?: string;
  zIndex?: string;
}

export function DraggableTourTooltip({
  children,
  isFirstStep = false,
  className,
  zIndex = 'z-50',
}: DraggableTourTooltipProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = (e.currentTarget.closest('[data-draggable-tooltip]') as HTMLElement)?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  }, []);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    
    // Constrain to viewport with padding
    const tooltipWidth = 420;
    const tooltipHeight = 300;
    const padding = 16;
    
    const constrainedX = Math.max(padding, Math.min(newX, window.innerWidth - tooltipWidth - padding));
    const constrainedY = Math.max(padding, Math.min(newY, window.innerHeight - tooltipHeight - padding));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div
      data-draggable-tooltip
      className={cn(
        'fixed pointer-events-auto',
        zIndex,
        !isDragging && 'transition-all duration-200 ease-out',
        className
      )}
      style={{
        left: position ? `${position.x}px` : '50%',
        top: position ? `${position.y}px` : '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div className="relative">
        {/* Drag Handle */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className={cn(
            'absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-t-lg cursor-grab active:cursor-grabbing',
            'bg-purple-500 hover:bg-purple-600 transition-colors',
            'flex items-center gap-1.5 group',
            isDragging && 'cursor-grabbing bg-purple-600'
          )}
        >
          <GripVertical className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
          <span className="text-xs text-white/80 font-medium hidden sm:inline">Drag</span>
        </div>
        
        {/* Content wrapper */}
        <div className="pt-6">
          {children}
        </div>
        
        {/* First-time tip */}
        {isFirstStep && !position && (
          <div className="mt-3 p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <GripVertical className="w-3 h-3 flex-shrink-0" />
              <span>Tip: Content blocked? Drag the purple handle to move me!</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
