import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import { useTranslate } from '../../../contexts/Translator.tsx';
import styles from './Lore.module.less';

export const MiniLore = () => {
    const { tokens } = useTranslate();

    return (
        <div className={styles.miniLore}>
            <ul className={styles.list}>
                <li>
                    {tokens.miniLore.race}:
                    <EditableInput stat={'race'} className='h-[6mm]' />
                </li>
                <li>
                    {tokens.miniLore.class}:
                    <EditableInput stat={'class'} className='h-[6mm]' />
                </li>
                <li>
                    {tokens.miniLore.age}:
                    <EditableInput
                        stat={'age'}
                        className='h-[6mm]'
                        type={'number'}
                        step={1}
                    />
                </li>
                <li>
                    {tokens.miniLore.height}:
                    <EditableInput stat={'height'} className='h-[6mm]' />
                </li>
                <li>
                    {tokens.miniLore.weight}:
                    <EditableInput stat={'weight'} className='h-[6mm]' />
                </li>
                <li>
                    {tokens.miniLore.background}:
                    <EditableInput stat={'background'} className='h-[6mm]' />
                </li>
                <li>
                    {tokens.miniLore.languages}:
                    <EditableInput stat={'languages'} className='h-[6mm]' />
                </li>
            </ul>
        </div>
    );
};
