import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dialog.module.less';

export interface DialogProps extends React.PropsWithChildren {
    open: boolean;
    onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, open, onClose }) => {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (open) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [open]);
    return (
        <>
            {createPortal(
                <dialog
                    className={styles.dialog}
                    ref={ref}
                    onClose={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <div
                        className={
                            'absolute top-[2mm] right-[3mm] cursor-pointer'
                        }
                        onClick={() => {
                            ref.current?.close();
                        }}
                    >
                        乂
                    </div>
                    {children}
                </dialog>,
                document.getElementById('root')!,
            )}
        </>
    );
};
