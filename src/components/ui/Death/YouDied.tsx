import React from 'react';
import { createPortal } from 'react-dom';

export const YouDied: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return createPortal(
        <div
            onClick={onClick}
            className='animate-appear grid place-items-center fixed top-0 bottom-0 left-0 right-0 text-5xl bg-black z-[10000000]'
        >
            <div className='font-DarkSouls text-[#7B1C16] w-full text-center pt-[15mm] pb-[15mm]'>
                YOU DIED
            </div>
        </div>,
        document.getElementById('root')!,
    );
};
