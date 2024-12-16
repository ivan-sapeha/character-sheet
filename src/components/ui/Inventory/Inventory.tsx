import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import { InvisibleTextarea } from '@components/ui/Inputs/Textarea.tsx';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { useTranslate } from '../../../contexts/Translator.tsx';
import styles from './Inventory.module.less';
export const Inventory = () => {
    const { tokens } = useTranslate();

    return (
        <div className={styles.inventory}>
            <div className={styles.headSection}>
                <div className={styles.money}>
                    <span className={styles.currency}>
                        <span className={styles.coin}>
                            <span
                                className={cx(styles.copper, styles.moneyIcon)}
                            />
                            {tokens.inventory.money.copper}:
                        </span>

                        <EditableInput
                            stat={'cp'}
                            className='h-[6mm] !w-[7mm] !p-[0.5mm] text-center'
                            type={'number'}
                            step={1}
                            textClassName={
                                'border-b border-black w-full text-center h-[27px]'
                            }
                        />
                    </span>
                    <span className={styles.currency}>
                        <span className={styles.coin}>
                            <span
                                className={cx(styles.silver, styles.moneyIcon)}
                            />
                            {tokens.inventory.money.silver}:
                        </span>
                        <EditableInput
                            stat={'sp'}
                            className='h-[6mm] !p-[0.5mm] text-center'
                            type={'number'}
                            step={1}
                            textClassName={
                                'border-b border-black w-full text-center h-[27px]'
                            }
                        />
                    </span>
                    <span className={styles.currency}>
                        <span className={styles.coin}>
                            <span
                                className={cx(styles.gold, styles.moneyIcon)}
                            />
                            {tokens.inventory.money.gold}:
                        </span>
                        <EditableInput
                            stat={'gp'}
                            className='h-[6mm] !p-[0.5mm] text-center'
                            type={'number'}
                            step={1}
                            textClassName={
                                'border-b border-black w-full text-center h-[27px]'
                            }
                        />
                    </span>
                </div>
                <h1
                    className={cx(styles.header, {
                        hidden: isMobile,
                    })}
                >
                    <span>{tokens.inventory.title}</span>
                </h1>
                <div className={styles.money}>
                    <span className={styles.currency}>
                        <span className={styles.coin}>
                            <span
                                className={cx(
                                    styles.electrum,
                                    styles.moneyIcon,
                                )}
                            />
                            {tokens.inventory.money.electrum}:
                        </span>
                        <EditableInput
                            stat={'ep'}
                            className='h-[6mm] !p-[0.5mm] text-center'
                            type={'number'}
                            step={1}
                            textClassName={
                                'border-b border-black w-full text-center h-[27px]'
                            }
                        />
                    </span>
                    <span className={styles.currency}>
                        <span className={styles.coin}>
                            <span
                                className={cx(
                                    styles.platinum,
                                    styles.moneyIcon,
                                )}
                            />
                            {tokens.inventory.money.platinum}:
                        </span>
                        <EditableInput
                            stat={'pp'}
                            className='h-[6mm] !p-[0.5mm] text-center'
                            type={'number'}
                            step={1}
                            textClassName={
                                'border-b border-black w-full text-center h-[27px]'
                            }
                        />
                    </span>
                </div>
            </div>
            <InvisibleTextarea stat={'inventory'} />
        </div>
    );
};
