import { Stat, StatProps } from '@components/ui';
import { Button } from '@components/ui/Button';
import cx from 'classnames';
import { FC } from 'react';
import { Character } from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { getModifier } from '../../../helpers/stats.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './FullStat.module.less';

export const FullStat: FC<StatProps> = ({ data, name, color, icon }) => {
    return (
        <div
            className={styles.fullStat}
            style={{ border: `2px solid ${color}` }}
        >
            <Stat data={data} name={name} color={color} icon={icon} />
            <div className={styles.checks}>
                {data.checks &&
                    Object.entries(data.checks).map(([key, val]) => (
                        <Check
                            key={key}
                            name={key}
                            statName={name}
                            value={val}
                            modifier={getModifier(data.value)}
                        />
                    ))}
            </div>
        </div>
    );
};

const Check: FC<{
    name: string;
    value: number;
    statName: string;
    modifier: number;
}> = ({ name, value, statName, modifier }) => {
    const { isEdit, currentCharacter, updateCurrentCharacter } = useCharacter();
    const { tokens } = useTranslate();

    const addToCheck = () => {
        const checks =
            currentCharacter.stats[statName as keyof Character['stats']]
                .checks!;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        checks[name] = checks[name] ? checks[name] + 1 : 1;
        updateCurrentCharacter(currentCharacter);
    };

    const removeFromCheck = () => {
        const checks =
            currentCharacter.stats[statName as keyof Character['stats']]
                .checks!;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        checks[name] = checks[name] ? checks[name] - 1 : -1;
        updateCurrentCharacter(currentCharacter);
    };
    return (
        <div className={styles.check}>
            <span className={cx(styles.text)}>
                {isEdit && (
                    <>
                        <Button
                            className={cx(styles.button, styles.buttonLeft)}
                            onClick={removeFromCheck}
                        >
                            -
                        </Button>
                        <Button
                            className={cx(styles.button, styles.buttonRight)}
                            onClick={addToCheck}
                        >
                            +
                        </Button>
                    </>
                )}
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    tokens.checks[name]
                }
            </span>
            <span className={cx(styles.value, { [styles.bonus]: value > 0 })}>
                {value + modifier}
            </span>
        </div>
    );
};
