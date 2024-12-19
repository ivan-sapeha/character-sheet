import cx from 'classnames';
import React from 'react';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './A4Sheet.module.less';

export interface A4SheetProps extends React.PropsWithChildren {
    className?: string;
    backgroundImage?: string;
}

export const A4Sheet: React.FC<A4SheetProps> = ({
    children,
    className,
    backgroundImage,
}) => {
    const { isEdit } = useCharacter();
    const style = backgroundImage ? { backgroundImage } : undefined;
    return (
        <div
            className={cx('!visible', styles.A4, className, {
                '!overflow-visible': isEdit,
            })}
            style={style}
        >
            {children}
        </div>
    );
};
