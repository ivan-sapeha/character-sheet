import cx from 'classnames';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Death.module.less';
type Level = 0 | 1 | 2 | 3;
export const Death = () => {
    const { tokens } = useTranslate();
    const { currentCharacter, updateStat } = useCharacter();

    const onClick = (level: Level, isSuccess: boolean) => {
        const statName = isSuccess ? 'success' : 'fail';
        updateStat(
            statName,
            currentCharacter[statName] === level
                ? ((level - 1) as Level)
                : level,
        );
    };
    return (
        <div className='flex flex-col w-full gap-[1mm]'>
            <div className={cx(styles.death, styles.save)}>
                <b>{tokens.deathSaves.successes}</b>
                <div onClick={() => onClick(1, true)}>
                    {currentCharacter.success >= 1 && '✓'}
                </div>
                <span></span>
                <div onClick={() => onClick(2, true)}>
                    {currentCharacter.success >= 2 && '✓'}
                </div>
                <span></span>
                <div onClick={() => onClick(3, true)}>
                    {currentCharacter.success == 3 && '✓'}
                </div>
            </div>
            <div className={styles.death}>
                <b>{tokens.deathSaves.failures}</b>
                <div onClick={() => onClick(1, false)}>
                    {currentCharacter.fail >= 1 && 'Ｘ'}
                </div>
                <span></span>
                <div onClick={() => onClick(2, false)}>
                    {currentCharacter.fail >= 2 && 'Ｘ'}
                </div>
                <span></span>
                <div onClick={() => onClick(3, false)}>
                    {currentCharacter.fail >= 3 && 'Ｘ'}
                </div>
            </div>
        </div>
    );
};
