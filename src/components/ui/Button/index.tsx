import cx from 'classnames';
import React from 'react';
import styles from './Button.module.less';

export const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            type={'button'}
            className={cx(styles.button, props.className as any)}
        >
            {children}
        </button>
    );
};
