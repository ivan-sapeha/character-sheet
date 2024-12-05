import cx from 'classnames';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Death.module.less';

export const Death = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className='flex flex-col w-full gap-[1mm]'
            style={isEdit ? inactiveStyle : undefined}
        >
            <div className={cx(styles.death, styles.save)}>
                <b>{tokens.deathSaves.successes}</b>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <div></div>
            </div>
            <div className={styles.death}>
                <b>{tokens.deathSaves.failures}</b>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <div></div>
            </div>
        </div>
    );
};
