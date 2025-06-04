import { useState, useEffect } from 'react';

export const useWindowDrag = (initialPosition: { x: number; y: number }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [windowPosition, setWindowPosition] = useState<{ x: number; y: number }>(initialPosition);

    const startDrag = (e: React.MouseEvent, onFocus: () => void) => {
        onFocus();
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        e.preventDefault();
    };

    const onDrag = (e: MouseEvent) => {
        if (isDragging) {
            setWindowPosition({
                x: Math.max(0, e.clientX - dragOffset.x),
                y: Math.max(0, e.clientY - dragOffset.y)
            });
        }
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    // Set up event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            return () => {
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
            };
        }
    }, [isDragging, dragOffset]);

    return {
        windowPosition,
        startDrag
    };
};