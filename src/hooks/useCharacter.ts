import { useContext, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Character } from '../constants/char.ts';
import { emptyCharacter } from '../constants/char.ts';
import {
    CurrentCharacterContext,
    CurrentCharacterContextValue,
} from '../contexts/CurrentCharacter.tsx';
import { EventListener } from '../helpers/generic-helpers.tsx';

export type CharacterManagerReturn = CurrentCharacterContextValue & {
    addNewCharacter: () => Character;
    saveCharacter: (character: Character) => void;
    allCharacters: Character[];
    getCharacterByID: (id: number) => Character | undefined;
    lastSelectedCharacter: Character | undefined;
    setLastCharacter: (id: number) => void;
    removeCharacter: (id: number) => void;
    onSave: (callback: () => void) => () => void;
    updateStat: <T extends Omit<keyof Character, 'stats'>>(
        key: T,
        value: Character[T],
    ) => void;
};

const onSaveEvent = new EventListener();
export const useCharacter = (): CharacterManagerReturn => {
    const { currentCharacter, updateCurrentCharacter, isEdit, toggleEdit } =
        useContext(CurrentCharacterContext);
    const [storedCharacters, setStoredCharactersOriginal] = useLocalStorage<
        Character[]
    >('characters', []);
    const setStoredCharacters = (chars: Character[]) => {
        setStoredCharactersOriginal(chars.toSorted((a, b) => a.id - b.id));
    };
    const [lastCharacter, setLastCharacter] = useLocalStorage<number>(
        'lastCharacter',
        currentCharacter.id,
    );

    const addNewCharacter = () => {
        let id = storedCharacters.length;
        while (storedCharacters.find((char) => char.id === id)) {
            id++;
        }
        const newCharacter = { ...emptyCharacter, id };
        setStoredCharacters([...storedCharacters, newCharacter]);
        return newCharacter;
    };

    const getCharacterByID = (id: number) => {
        if (id >= storedCharacters.length || id < 0) {
            throw new Error(`Character with id: ${id} does not exist.`);
        }
        return storedCharacters.find((character) => character.id === id);
    };

    const lastSelectedCharacter = storedCharacters.find(
        (character) => character.id === lastCharacter,
    );

    const saveCharacter = (character: Character) => {
        const index = storedCharacters.findIndex(
            (char) => char.id === character.id,
        );
        if (index === -1) {
            setStoredCharacters([
                ...storedCharacters,
                { ...character, id: storedCharacters.length },
            ]);
            setLastCharacter(storedCharacters.length);
            return;
        }
        storedCharacters.splice(index, 1, character);
        setStoredCharacters(storedCharacters);
        setLastCharacter(character.id);
        onSaveEvent.dispatch();
    };

    const removeCharacter = (id: number) => {
        const index = storedCharacters.findIndex((char) => char.id === id);
        if (index !== -1) {
            storedCharacters.splice(index, 1);
            setStoredCharacters(storedCharacters);
            if (lastCharacter === id) {
                if (storedCharacters.length >= 1) {
                    setLastCharacter(storedCharacters[0].id);
                }
            }
        }
    };

    const onSave = (callback: () => void) => {
        onSaveEvent.addEventListener(callback);
        return () => {
            onSaveEvent.removeEventListener(callback);
        };
    };

    function updateStat<T extends Omit<keyof Character, 'stats'>>(
        key: T,
        value: Character[T],
    ) {
        updateCurrentCharacter({ ...currentCharacter, [key]: value });
    }

    return {
        currentCharacter,
        updateCurrentCharacter,
        addNewCharacter,
        allCharacters: storedCharacters,
        getCharacterByID,
        lastSelectedCharacter,
        saveCharacter,
        setLastCharacter,
        isEdit,
        toggleEdit,
        removeCharacter,
        onSave,
        updateStat,
    };
};
