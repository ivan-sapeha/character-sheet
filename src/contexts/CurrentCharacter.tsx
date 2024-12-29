import React, { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Character } from '../constants/char.ts';
import { emptyCharacter } from '../constants/char.ts';
import { clone } from '../helpers/generic-helpers.tsx';

export interface CurrentCharacterContextValue {
    currentCharacter: Character;
    updateCurrentCharacter: (character: Character | undefined) => Character;
    isEdit: boolean;
    isPrinting: boolean;
    toggleEdit: () => boolean;
    setIsPrinting: (value: boolean) => void;
}

export const CurrentCharacterContext =
    React.createContext<CurrentCharacterContextValue>({
        currentCharacter: emptyCharacter,
        updateCurrentCharacter: () => emptyCharacter,
        isEdit: false,
        isPrinting: false,
        toggleEdit: () => false,
        setIsPrinting: () => void 0,
    });

export const CurrentCharacterProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [lastCharacter] = useLocalStorage('lastCharacter', 0);
    const [characters] = useLocalStorage('characters', []);
    const [character, setCharacter] = useState<Character>(
        characters[lastCharacter] ?? emptyCharacter,
    );
    const [isEdit, setIsEdit] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const toggleEdit = () => {
        setIsEdit(!isEdit);
        return !isEdit;
    };

    return (
        <CurrentCharacterContext.Provider
            value={{
                currentCharacter: character,
                updateCurrentCharacter: (character: Character | undefined) => {
                    const updatedCharacter = clone(character ?? emptyCharacter);
                    setCharacter(updatedCharacter);
                    return updatedCharacter;
                },
                isEdit,
                toggleEdit,
                isPrinting,
                setIsPrinting,
            }}
        >
            {children}
        </CurrentCharacterContext.Provider>
    );
};
