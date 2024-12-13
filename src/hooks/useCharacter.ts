import { useContext, useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useLocalStorage } from 'usehooks-ts';
import { Character, ExportedCharacter } from '../constants/char.ts';
import { emptyCharacter } from '../constants/char.ts';
import {
    CurrentCharacterContext,
    CurrentCharacterContextValue,
} from '../contexts/CurrentCharacter.tsx';
import { ImageDBData } from '../db';
import { b64ToFile, fileToB64 } from '../helpers/convert.ts';
import {
    EventListener,
    skipEventLoopTimes,
} from '../helpers/generic-helpers.tsx';
import { PassiveData, usePassives } from './usePassives.ts';

export type CharacterManagerReturn = CurrentCharacterContextValue & {
    addNewCharacter: (character?: Character) => Character;
    saveCharacter: (character: Character) => void;
    allCharacters: Character[];
    getCharacterByID: (id: number) => Character | undefined;
    lastSelectedCharacter: Character | undefined;
    setLastCharacter: (id: number) => void;
    removeCharacter: (id: number) => void;
    exportCharacter: (character: Character) => Promise<ExportedCharacter>;
    importCharacter: (data: ExportedCharacter) => Promise<Character>;
    onSave: (callback: () => void) => () => void;
    updateStat: <T extends keyof Character>(
        key: T,
        value: Character[T],
    ) => Character;
};

const onSaveEvent = new EventListener();
export const useCharacter = (): CharacterManagerReturn => {
    const { currentCharacter, updateCurrentCharacter, isEdit, toggleEdit } =
        useContext(CurrentCharacterContext);
    const [storedCharacters, setStoredCharactersOriginal] = useLocalStorage<
        Character[]
    >('characters', []);

    const { getByID: getBackground, add: addBackground } =
        useIndexedDB('background');
    const { getByID: getAvatar, add: addAvatar } = useIndexedDB('avatar');
    const { getPassivesInOrder, getPassiveIdByData, addPassive } =
        usePassives();
    const setStoredCharacters = (chars: Character[]) => {
        setStoredCharactersOriginal(chars.toSorted((a, b) => a.id - b.id));
    };
    const [lastCharacter, setLastCharacter] = useLocalStorage<number>(
        'lastCharacter',
        currentCharacter.id,
    );

    const addNewCharacter = (character?: Character) => {
        let id = storedCharacters.length;
        while (storedCharacters.find((char) => char.id === id)) {
            id++;
        }
        const data = character ? character : emptyCharacter;

        const newCharacter = { ...data, id };
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

    function updateStat<T extends keyof Character>(
        key: T,
        value: Character[T],
    ) {
        const updatedCharacter = { ...currentCharacter, [key]: value };
        updateCurrentCharacter(updatedCharacter);
        return updatedCharacter;
    }

    const exportCharacter = async (
        character: Character,
    ): Promise<ExportedCharacter> => {
        const avatar = (await getAvatar<ImageDBData>(character.photo)) ?? -1;
        const passives: PassiveData[] = getPassivesInOrder(character.passives);
        let background: ExportedCharacter['background'] = -1;
        if (character.backgroundImage !== -1) {
            const backgroundData = await getBackground<ImageDBData>(
                character.backgroundImage,
            );

            background = backgroundData?.name?.includes(
                'backgrounds/preprocessed/',
            )
                ? character.backgroundImage
                : {
                      ...backgroundData,
                      image: await fileToB64(backgroundData.image as File),
                  };
        }
        return { character, avatar, background, passives } as ExportedCharacter;
    };

    const importCharacter = async (
        data: ExportedCharacter,
    ): Promise<Character> => {
        const {
            passives: passivesData,
            character,
            avatar: avatarData,
            background: backgroundData,
        } = data;
        const passives = [];
        for (const passive of passivesData) {
            const id = getPassiveIdByData(passive);
            if (id !== -1) {
                passives.push(id);
            } else {
                passives.push(addPassive(passive));
            }
        }

        let avatar = -1;
        if (avatarData !== -1) {
            const { name, image } = avatarData as ImageDBData;
            avatar = await addAvatar({ name, image });
        }

        let background = backgroundData as number;
        if (backgroundData !== -1) {
            if (typeof backgroundData !== 'number') {
                background =
                    (await addBackground({
                        name: backgroundData.name,
                        image: await b64ToFile(
                            backgroundData.name,
                            backgroundData.image as string,
                        ),
                    })) ?? -1;
            }
        }

        character.passives = passives;
        character.photo = avatar;
        character.backgroundImage = background;
        return character;
    };

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
        exportCharacter,
        importCharacter,
    };
};
