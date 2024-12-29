import { useEffect, useState } from 'react';

export const useAudio = (url: string): [boolean, () => void] => {
    const [audio, setAudio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        if (playing) {
            audio.play();
        } else {
            audio.pause();
            setAudio(new Audio(url));
        }
    }, [playing]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};
