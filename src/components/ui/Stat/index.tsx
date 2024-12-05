import { Button } from '@components/ui/Button';
import { FC } from 'react';
import { Character } from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { getModifier } from '../../../helpers/stats.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Stat.module.less';
import cx from 'classnames';

export interface StatProps {
    color: string;
    icon: string;
    data: Character['stats'][keyof Character['stats']];
    name: string;
}

export const Stat: FC<StatProps> = ({ data, color, icon, name }) => {
    const { isEdit, currentCharacter, updateCurrentCharacter } = useCharacter();
    const { tokens } = useTranslate();
    const { save, value } = data;
    const pureModifier = getModifier(value);
    const saveModifier = pureModifier + (save ? Number(save) : 0);

    const addToStat = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const stat = currentCharacter.stats[name];
        stat.value = stat.value ? stat.value + 1 : 1;
        updateCurrentCharacter(currentCharacter);
    };

    const removeFromStat = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const stat = currentCharacter.stats[name];
        stat.value = stat.value ? stat.value - 1 : -1;
        updateCurrentCharacter(currentCharacter);
    };

    const addToSave = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const stat = currentCharacter.stats[name];
        stat.save = stat.save ? stat.save + 1 : 1;
        updateCurrentCharacter(currentCharacter);
    };
    const removeFromSave = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const stat = currentCharacter.stats[name];
        stat.save = stat.save ? stat.save - 1 : -1;
        updateCurrentCharacter(currentCharacter);
    };

    return (
        <div className={styles.statContainer} style={{ color }}>
            {isEdit && (
                <>
                    <Button
                        className={cx(styles.statButton, styles.leftButton)}
                        onClick={removeFromStat}
                    >
                        -
                    </Button>
                    <Button
                        className={cx(styles.statButton, styles.rightButton)}
                        onClick={addToStat}
                    >
                        +
                    </Button>
                </>
            )}
            <div className={styles.stat}>
                <div className={styles.statTop}>
                    <div className={styles.statTopIcon}>
                        <img className={styles.statTopIconImage} src={icon} />
                    </div>
                    <div className={styles.statTopValues}>
                        <span className={cx(styles.text)}>{value}</span>
                        <span
                            className={cx(
                                styles.text,
                                styles.statTopValuesBonus,
                            )}
                        >
                            {pureModifier > 0
                                ? `+${pureModifier}`
                                : pureModifier}
                        </span>
                    </div>
                </div>
                <div className={styles.statName}>
                    {tokens.stats[name as keyof (typeof data)['checks']]}
                </div>
            </div>
            <div className={styles.saveSection}>
                {isEdit && (
                    <>
                        <Button
                            className={cx(styles.button, styles.buttonTop)}
                            onClick={addToSave}
                        >
                            +
                        </Button>
                        <Button
                            className={cx(styles.button, styles.buttonBottom)}
                            onClick={removeFromSave}
                        >
                            -
                        </Button>
                    </>
                )}
                <span
                    className={cx(styles.text, {
                        [styles.saveBonus]: saveModifier !== pureModifier,
                    })}
                >
                    {saveModifier}
                </span>
            </div>
        </div>
    );
};
