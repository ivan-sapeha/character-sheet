import cx from 'classnames';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Inventory.module.less';
export const Inventory = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={styles.inventory}
            style={isEdit ? inactiveStyle : undefined}
        >
            <div className={styles.money}>
                <span>
                    <span className={cx(styles.copper, styles.moneyIcon)} />
                    {tokens.inventory.money.copper}:
                </span>
                <span>
                    <span className={cx(styles.silver, styles.moneyIcon)} />
                    {tokens.inventory.money.silver}:
                </span>
                <span>
                    <span className={cx(styles.gold, styles.moneyIcon)} />
                    {tokens.inventory.money.gold}:
                </span>
            </div>
            <h1 className={styles.header}>
                <span>{tokens.inventory.title}</span>
            </h1>
            <div className={styles.money}>
                <span>
                    <span className={cx(styles.electrum, styles.moneyIcon)} />
                    {tokens.inventory.money.electrum}:
                </span>
                <span>
                    <span className={cx(styles.platinum, styles.moneyIcon)} />
                    {tokens.inventory.money.platinum}:
                </span>
            </div>
        </div>
    );
};
