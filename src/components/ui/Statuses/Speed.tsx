import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { emptyCharacter } from '../../../constants/char.ts';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Statuses.module.less';

export const Speed = () => {
    const { tokens } = useTranslate();
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>{tokens.speed.title}</h1>
            <ul className={styles.speed}>
                <li>
                    {tokens.speed.walk}:{' '}
                    <EditableInput
                        stat={'walk'}
                        className='h-[6mm] !w-[12mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
                <li>
                    {tokens.speed.run}:
                    <EditableInput
                        stat={'run'}
                        className='h-[6mm] !w-[12mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
                <li>
                    {tokens.speed.climb}:
                    <EditableInput
                        stat={'climb'}
                        className='h-[6mm] !w-[12mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
                <li>
                    {tokens.speed.swim}:
                    <EditableInput
                        stat={'swim'}
                        className='h-[6mm] !w-[12mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
                <li>
                    {tokens.speed.mount}:
                    <EditableInput
                        stat={'mount'}
                        className='h-[6mm] !w-[12mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
            </ul>
        </div>
    );
};
