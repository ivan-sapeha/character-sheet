import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import cx from 'classnames';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { getModifier } from '../../../helpers/stats.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Statuses.module.less';
import perc from '@assets/images/preprocessed/perception-hd-transparent.png';
import hammer from '@assets/images/preprocessed/hammer-hd-transparent.png';
import bulb from '@assets/images/preprocessed/bulb-hd-transparent.png';
import insp from '@assets/images/preprocessed/insp-hd-transparent.png';

export const Skills = () => {
    const { tokens } = useTranslate();
    const { currentCharacter } = useCharacter();
    return (
        <div className={cx(styles.container, styles.skills)}>
            <h1 className={styles.header}>{tokens.skills.title}</h1>
            <div className={styles.statuses}>
                <div className={styles.status}>
                    <img src={bulb} style={{ height: '7mm', aspectRatio: 1 }} />
                    {tokens.skills.initiative}
                    <EditableInput
                        stat={'initiative'}
                        className='h-[6mm] !w-[7mm] !p-[0.5mm] text-center'
                        type={'number'}
                        step={1}
                    />
                </div>
                <div className={styles.status}>
                    <img
                        src={hammer}
                        style={{ height: '7mm', aspectRatio: 1 }}
                    />
                    {tokens.skills.proficiency}
                    <EditableInput
                        stat={'proficiency'}
                        className='h-[6mm] !w-[7mm] !p-[0.5mm] text-center'
                        type={'number'}
                        step={1}
                    />
                </div>
                <div className={styles.status}>
                    <img src={perc} style={{ height: '7mm', aspectRatio: 1 }} />
                    {tokens.skills.perception}
                    <EditableInput
                        stat={'perception'}
                        className='h-[6mm] !w-[7mm] !p-[0.5mm] text-center'
                        type={'number'}
                        step={1}
                        defaultString={String(
                            10 +
                                getModifier(
                                    currentCharacter.stats.wisdom.value,
                                ),
                        )}
                    />
                </div>
                <div className={styles.status}>
                    <img src={insp} style={{ height: '7mm', aspectRatio: 1 }} />
                    {tokens.skills.inspiration}
                    <EditableInput
                        stat={'inspiration'}
                        className='h-[6mm] !w-[7mm] !p-[0.5mm] text-center'
                        type={'number'}
                        step={1}
                    />
                </div>
            </div>
        </div>
    );
};
