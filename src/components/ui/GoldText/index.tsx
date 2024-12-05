import { FC, PropsWithChildren } from 'react';
import styles from './GoldText.module.less'

export const GoldText: FC<PropsWithChildren> = ({ children }) => {
    return <div className={styles.wrapper}>
        <div className={styles.bg}> { children } </div>
        <div className={styles.fg}> { children } </div>
    </div>;
};