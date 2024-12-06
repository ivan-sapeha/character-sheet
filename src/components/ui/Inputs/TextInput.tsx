import cx from 'classnames';
import styles from './Inputs.module.less';
import React from 'react';
export interface TextInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (newVal: string) => void;
    placeholder?: string;
}
export const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    className,
    placeholder,
    ...props
}) => {
    return (
        <input
            type={'text'}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cx(styles.text, className)}
            {...props}
        />
    );
};
