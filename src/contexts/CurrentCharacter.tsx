import React, { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Character } from '../constants/char.ts';
import { emptyCharacter } from '../constants/char.ts';
import { clone } from '../helpers/generic-helpers.tsx';

export interface CurrentCharacterContextValue {
    currentCharacter: Character;
    updateCurrentCharacter: (character: Character | undefined) => void;
    isEdit: boolean;
    toggleEdit: () => boolean;
}

export const CurrentCharacterContext =
    React.createContext<CurrentCharacterContextValue>({
        currentCharacter: emptyCharacter,
        updateCurrentCharacter: () => {},
        isEdit: false,
        toggleEdit: () => false,
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
    const toggleEdit = () => {
        setIsEdit(!isEdit);
        return !isEdit;
    };

    return (
        <CurrentCharacterContext.Provider
            value={{
                currentCharacter: character,
                updateCurrentCharacter: (character: Character | undefined) =>
                    setCharacter(clone(character ?? emptyCharacter)),
                isEdit,
                toggleEdit,
            }}
        >
            {children}
        </CurrentCharacterContext.Provider>
    );
};
