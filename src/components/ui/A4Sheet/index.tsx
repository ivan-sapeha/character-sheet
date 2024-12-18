import cx from 'classnames';
import React from 'react';
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
    const style = backgroundImage ? { backgroundImage } : undefined;
    return (
        <div className={cx(styles.A4, className)} style={style}>
            {children}
        </div>
    );
};
