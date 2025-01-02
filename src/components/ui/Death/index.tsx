import { YouDied } from '@components/ui/Death/YouDied.tsx';
import cx from 'classnames';
import { useEffect } from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useAudio } from '../../../hooks/useAudio.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Death.module.less';
import deathSound from '@assets/sound/death.mp3';
type Level = 0 | 1 | 2 | 3;
export const Death = () => {
    const { tokens } = useTranslate();
    const { currentCharacter, updateStatLive } = useCharacter();
    const [isAudioPlaying, toggle] = useAudio(deathSound);
    const onClick = (level: Level, isSuccess: boolean) => {
        const statName = isSuccess ? 'success' : 'fail';
        updateStatLive(
            statName,
            currentCharacter[statName] === level
                ? ((level - 1) as Level)
                : level,
        );
    };
    useEffect(() => {
        if (currentCharacter.fail === 3) {
            toggle();
            navigator.vibrate(400);
        } else if (isAudioPlaying) {
            toggle();
        }
    }, [currentCharacter.fail]);
    return (
        <div className='flex flex-col w-full gap-[1mm]'>
            {currentCharacter.fail === 3 && (
                <YouDied onClick={() => updateStatLive('fail', 0)} />
            )}
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
