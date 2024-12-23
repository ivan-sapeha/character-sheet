import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dialog.module.less';

export interface DialogProps extends React.PropsWithChildren {
    open: boolean;
    onClose: () => void;
    className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
    children,
    open,
    onClose,
    className,
}) => {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (open) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [open]);
    useEffect(() => {
        ref.current?.scrollTo(0, 0);
    }, []);
    return (
        <>
            {createPortal(
                <dialog
                    className={cx(
                        styles.dialog,
                        className,
                        'small:mr-0 small:ml-0 small:w-full small:max-w-full',
                    )}
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
                    <div className='overflow-auto w-full h-full'>
                        {children}
                    </div>
                </dialog>,
                document.getElementById('root')!,
            )}
        </>
    );
};
