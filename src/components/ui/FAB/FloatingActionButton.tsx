import React, { useState, useEffect, useRef } from 'react';

interface ScrollTriggeredElementProps {
    scrollThreshold?: number;
    debounceDelay?: number;
    children: React.ReactNode;
    className?: string;
}

export const FloatingActionButton: React.FC<ScrollTriggeredElementProps> = ({
    scrollThreshold = 60,
    debounceDelay = 100,
    children,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= scrollThreshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const debouncedHandleScroll = () => {
            clearTimeout(timeoutRef.current as number);
            timeoutRef.current = setTimeout(
                handleScroll,
                debounceDelay,
            ) as unknown as number;
        };

        window.addEventListener('scroll', debouncedHandleScroll);

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
            clearTimeout(timeoutRef.current as number);
        };
    }, [scrollThreshold, debounceDelay]);

    return <div className={isVisible ? className : 'hidden'}>{children}</div>;
};
