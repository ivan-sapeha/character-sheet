import cx from 'classnames';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Statuses.module.less';
import perc from '@assets/images/preprocessed/perception-hd-transparent.png';
import hammer from '@assets/images/preprocessed/hammer-hd-transparent.png';
import bulb from '@assets/images/preprocessed/bulb-hd-transparent.png';
import insp from '@assets/images/preprocessed/insp-hd-transparent.png';

export const Skills = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={cx(styles.container, styles.skills)}
            style={isEdit ? inactiveStyle : undefined}
        >
            <h1 className={styles.header}>{tokens.skills.title}</h1>
            <div className={styles.statuses}>
                <div className={styles.status}>
                    <img src={bulb} />
                    {tokens.skills.initiative}
                </div>
                <div className={styles.status}>
                    <img src={hammer} />
                    {tokens.skills.proficiency}
                </div>
                <div className={styles.status}>
                    <img src={perc} />
                    {tokens.skills.perception}
                </div>
                <div className={styles.status}>
                    <img src={insp} />
                    {tokens.skills.inspiration}
                </div>
            </div>
        </div>
    );
};
