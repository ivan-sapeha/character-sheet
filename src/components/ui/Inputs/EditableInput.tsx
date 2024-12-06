import { TextInput, TextInputProps } from '@components/ui/Inputs/TextInput.tsx';
import cx from 'classnames';
import { Character, emptyCharacter } from '../../../constants/char.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export interface EditableInputProps extends Partial<TextInputProps> {
    stat: keyof Character;
    textClassName?: string;
}

export const EditableInput: React.FC<EditableInputProps> = ({
    stat,
    textClassName,
    ...props
}) => {
    const { currentCharacter, updateStat, isEdit } = useCharacter();

    return (
        <>
            {isEdit ? (
                <TextInput
                    value={
                        currentCharacter[stat]?.toString() ??
                        emptyCharacter[stat].toString()
                    }
                    onChange={(text) => updateStat(stat, text)}
                    {...props}
                />
            ) : (
                <span className={cx('font-Advent', textClassName)}>
                    {currentCharacter[stat].toString() ??
                        emptyCharacter[stat].toString()}
                </span>
            )}
        </>
    );
};
