import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { emptyCharacter } from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Lore.module.less';

export const MiniLore = () => {
    const { tokens } = useTranslate();
    const { isEdit, currentCharacter, updateCurrentCharacter } = useCharacter();
    function updateCharLore<T extends keyof typeof currentCharacter>(
        key: T,
        value: (typeof currentCharacter)[T],
    ) {
        updateCurrentCharacter({ ...currentCharacter, [key]: value });
    }

    return (
        <div className={styles.miniLore}>
            <ul className={styles.list}>
                <li>
                    {tokens.miniLore.race}:
                    {isEdit ? (
                        <TextInput
                            value={currentCharacter.race ?? emptyCharacter.race}
                            onChange={(text) => updateCharLore('race', text)}
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.race ?? emptyCharacter.race}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.class}:
                    {isEdit ? (
                        <TextInput
                            value={
                                currentCharacter.class ?? emptyCharacter.class
                            }
                            onChange={(text) => updateCharLore('class', text)}
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.class ?? emptyCharacter.class}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.age}:
                    {isEdit ? (
                        <TextInput
                            value={currentCharacter.age ?? emptyCharacter.age}
                            onChange={(text) => updateCharLore('age', text)}
                            className='h-[6mm]'
                            type={'number'}
                            step={1}
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.age ?? emptyCharacter.age}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.height}:
                    {isEdit ? (
                        <TextInput
                            value={
                                currentCharacter.height ?? emptyCharacter.height
                            }
                            onChange={(text) => updateCharLore('height', text)}
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.height ?? emptyCharacter.height}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.weight}:
                    {isEdit ? (
                        <TextInput
                            value={
                                currentCharacter.weight ?? emptyCharacter.weight
                            }
                            onChange={(text) => updateCharLore('weight', text)}
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.weight ?? emptyCharacter.weight}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.background}:
                    {isEdit ? (
                        <TextInput
                            value={
                                currentCharacter.background ??
                                emptyCharacter.background
                            }
                            onChange={(text) =>
                                updateCharLore('background', text)
                            }
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.background ??
                                emptyCharacter.background}
                        </span>
                    )}
                </li>
                <li>
                    {tokens.miniLore.languages}:
                    {isEdit ? (
                        <TextInput
                            value={
                                currentCharacter.languages ??
                                emptyCharacter.languages
                            }
                            onChange={(text) =>
                                updateCharLore('languages', text)
                            }
                            className='h-[6mm]'
                        />
                    ) : (
                        <span className='font-Advent'>
                            {currentCharacter.languages ??
                                emptyCharacter.languages}
                        </span>
                    )}
                </li>
            </ul>
        </div>
    );
};
