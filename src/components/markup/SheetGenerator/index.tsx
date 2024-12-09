import { Sheet } from '@components/markup/CharacterSheet/Sheet.tsx';
import { BackgroundSelectionDialog } from '@components/markup/Editor/BackgroundSelection.tsx';
import { CharacterSelectionDialog } from '@components/markup/Editor/CharacterSelection.tsx';
import {
    PrintDialog,
    printStorageKey,
} from '@components/markup/Editor/PrintDialog.tsx';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useLocalStorage } from 'usehooks-ts';
import { HPDice } from '../../../constants/char.ts';
import { Locale, useTranslate } from '../../../contexts/Translator.tsx';
import { svgToCssUrl } from '../../../helpers/convert.ts';
import {
    entries,
    getRandomArrayItem,
    keys,
    skipEventLoopTimes,
} from '../../../helpers/generic-helpers.tsx';
import { fetchWithHandling } from '../../../helpers/network.ts';
import { printContent } from '../../../helpers/print.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import autogeneratedValues from '../../../constants/autogenerated-do-not-change.json';
import rand from '../../../assets/images/icons/random.svg';
let ranOnce = false;
export const SheetGenerator = () => {
    const {
        isEdit,
        toggleEdit,
        currentCharacter,
        updateCurrentCharacter,
        saveCharacter,
        lastSelectedCharacter,
    } = useCharacter();
    const { tokens, load, availableLanguages, currentLocale } = useTranslate();
    const [randomNames, setRandomNames] = useState<{
        names: string[];
        surnames: string[];
    }>({ names: [], surnames: [] });
    const [printing, setPrinting] = useState(false);
    const [printDialogOpened, setPrintDialogOpened] = useState(false);
    const [backgroundDialogOpened, setBackgroundDialogOpened] = useState(false);
    const [characterDialogOpened, setCharacterDialogOpened] = useState(false);
    const [iconsProgress, setIconsProgress] = useState(0);
    const [backgroundsProgress, setBackgroundsProgress] = useState(0);
    const { getAll: getAllBackgrounds, add: addBackground } =
        useIndexedDB('background');
    const { getAll: getAllIcons, add: addIcon } = useIndexedDB('icon');
    const [printPassives, setPrintPassives] = useLocalStorage(
        'print-passives',
        false,
    );
    const onPrint = async () => {
        if (localStorage.getItem(printStorageKey) || printDialogOpened) {
            setPrinting(true);
            await skipEventLoopTimes(200);
            printContent(
                document.getElementsByClassName('print')[0] as HTMLDivElement,
                `${currentCharacter.name}_${currentCharacter.surname}`,
            );
            setPrinting(false);
        } else {
            setPrinting(true);
            setPrintDialogOpened(true);
        }
    };
    const onEditClick = () => {
        if (isEdit) {
            saveCharacter(currentCharacter);
        }
        toggleEdit();
    };

    useEffect(() => {
        fetchWithHandling<{ names: string[]; surnames: string[] }>(
            `randomNames-${currentLocale}.json`,
        ).then((data) => setRandomNames(data));
    }, [currentLocale]);

    useEffect(() => {
        updateCurrentCharacter(lastSelectedCharacter);
    }, [lastSelectedCharacter]);

    useEffect(() => {
        if (ranOnce) {
            return;
        }
        ranOnce = true;
        getAllBackgrounds().then((backgrounds) => {
            if (backgrounds.length > 0) {
                setBackgroundsProgress(50);
                return;
            }

            fetchWithHandling<string[]>('backgrounds.json').then((res) => {
                const loadCoefficient = 50 / res.length;
                const load = res.map((link) =>
                    fetchWithHandling<Blob>(link, {
                        responseType: 'blob',
                    }).then(async (data) => {
                        setBackgroundsProgress(
                            (progress) => progress + loadCoefficient,
                        );
                        return { name: link, image: data };
                    }),
                );
                Promise.all(load).then((images) =>
                    images.forEach((image) => addBackground(image)),
                );
            });
        });

        getAllIcons().then((icons) => {
            if (icons.length > 0) {
                setIconsProgress(50);
                return;
            }

            fetchWithHandling<{
                template: string;
                icons: Record<string, string>;
            }>('icons.json', {
                onDownloadProgress: (data) => {
                    // console.log(data);
                    const progress = Number(
                        data.loaded / autogeneratedValues.iconsSize,
                    );
                    setIconsProgress(
                        Math.min(
                            (Number.isNaN(progress) ? 1 : progress) * 40,
                            40,
                        ),
                    );
                },
            })
                .then((res) => {
                    const { template, icons } = res;
                    return Promise.all(
                        entries(icons).map(([name, path]) => {
                            const icon = {
                                name,
                                image: svgToCssUrl(
                                    template.replace('{path}', path),
                                ),
                            };
                            return addIcon(icon);
                        }),
                    );
                })
                .then(() => setIconsProgress(50));
        });
    }, []);
    const progress = Math.min(iconsProgress + backgroundsProgress, 100);

    if (progress < 98) {
        return (
            <div className='flex justify-center items-center flex-col text-white h-[90vh] gap-[5mm] w-full'>
                <div className='flex justify-center flex-col'>
                    <span className='text-[20pt]'>
                        Loading assets, please wait..
                    </span>
                    <div className='border w-full h-[30px] rounded relative p-[3px]'>
                        <div
                            className='h-full bg-white rounded-[3px]'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <span className='font-Advent text-center'>
                    This is single time load,
                    <br /> please dont refresh/close this page.
                </span>
            </div>
        );
    }
    return (
        <>
            <div
                className={
                    'flex gap-2 p-2.5 w-fit text-[#ebebeb] flex-wrap max-w-[210mm] justify-center'
                }
            >
                <button
                    className={
                        'border border-[#ebebeb] rounded p-0.5 min-w-[25mm] hover:bg-gray-200 hover:text-black'
                    }
                    onClick={onEditClick}
                >
                    {isEdit ? tokens.UI.save : tokens.UI.edit}
                </button>
                {!isEdit && (
                    <>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>{tokens.UI.printPassives}:</label>
                            <input
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded p-0.5'
                                }
                                checked={printPassives}
                                onChange={(e) =>
                                    setPrintPassives(e.target.checked)
                                }
                            />
                        </span>
                        <div
                            className={
                                'border border-[#ebebeb] rounded min-w-[33mm]'
                            }
                        >
                            <button
                                className={
                                    'border-r border-[#ebebeb] p-0.5 min-w-[25mm] hover:bg-gray-200 hover:text-black'
                                }
                                onClick={onPrint}
                            >
                                {tokens.UI.print}
                            </button>
                            <button
                                className={
                                    'p-0.5 min-w-[7mm] hover:bg-gray-200 hover:text-black font-Advent'
                                }
                                onClick={() => setPrintDialogOpened(true)}
                            >
                                ?
                            </button>
                        </div>

                        {printDialogOpened && (
                            <PrintDialog
                                open={printDialogOpened}
                                onClose={() => setPrintDialogOpened(false)}
                                onPrint={onPrint}
                            />
                        )}

                        <button
                            className={
                                'border border-[#ebebeb] rounded p-0.5 min-w-[35mm] hover:bg-gray-200 hover:text-black'
                            }
                            onClick={() => setCharacterDialogOpened(true)}
                        >
                            {tokens.UI.changeCharacter}
                        </button>
                        <span className={'flex gap-2 items-center'}>
                            <label>{tokens.UI.language}:</label>
                            <select
                                className={
                                    'border border-[#ebebeb] rounded p-0.5 font-Advent bg-background hover:bg-gray-200 hover:text-black'
                                }
                                onChange={(e) => load(e.target.value as Locale)}
                                value={currentLocale}
                            >
                                {entries(availableLanguages).map(
                                    ([key, val]) => (
                                        <option key={key} value={key}>
                                            {val}
                                        </option>
                                    ),
                                )}
                            </select>
                        </span>
                        <CharacterSelectionDialog
                            open={characterDialogOpened}
                            onClose={() => setCharacterDialogOpened(false)}
                        />
                    </>
                )}
                {isEdit && (
                    <>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>{tokens.UI.name}:</label>
                            <button
                                className='w-[8mm] hover:brightness-50'
                                title={`${
                                    tokens.UI.random
                                } ${tokens.UI.name.toLowerCase()}`}
                                onClick={() =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        name: getRandomArrayItem(
                                            randomNames.names,
                                        ),
                                    })
                                }
                            >
                                <img src={rand} />
                            </button>
                            <input
                                type='text'
                                maxLength={14}
                                className={
                                    'border border-[#ebebeb] rounded p-0.5 bg-background hover:bg-gray-200 hover:text-black focus:bg-gray-200 focus:text-black outline-0 font-Advent w-[105px]'
                                }
                                value={currentCharacter.name}
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </span>

                        <span className={'flex gap-2 items-center'}>
                            <label>{tokens.UI.surname}:</label>
                            <button
                                className='w-[8mm] hover:brightness-50'
                                title={`${
                                    tokens.UI.random
                                } ${tokens.UI.surname.toLowerCase()}`}
                                onClick={() =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        surname: getRandomArrayItem(
                                            randomNames.surnames,
                                        ),
                                    })
                                }
                            >
                                <img src={rand} />
                            </button>
                            <input
                                type='text'
                                maxLength={14}
                                className={
                                    'border border-[#ebebeb] rounded p-0.5 bg-background hover:bg-gray-200 hover:text-black focus:bg-gray-200 focus:text-black outline-0 font-Advent w-[105px]'
                                }
                                value={currentCharacter.surname}
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        surname: e.target.value,
                                    })
                                }
                            />
                        </span>
                        <span className={'flex gap-2 items-center'}>
                            <label>{tokens.UI.dice}:</label>
                            <select
                                className={
                                    'cursor-pointer border border-[#ebebeb] rounded p-0.5 font-Advent bg-background hover:bg-gray-200 hover:text-black outline-0'
                                }
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        dice: e.target.value as HPDice,
                                    })
                                }
                                value={currentCharacter.dice}
                            >
                                {keys(HPDice).map((key) => (
                                    <option key={key} value={HPDice[key]}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>Show lore:</label>
                            <input
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded p-0.5'
                                }
                                checked={currentCharacter.showLore ?? true}
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        showLore: e.target.checked,
                                    })
                                }
                            />
                        </span>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>Show speed:</label>
                            <input
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded p-0.5'
                                }
                                checked={currentCharacter.showSpeed ?? true}
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        showSpeed: e.target.checked,
                                    })
                                }
                            />
                        </span>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>{tokens.UI.manaTracker}:</label>
                            <input
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded p-0.5'
                                }
                                checked={currentCharacter.manaTracker}
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        manaTracker: e.target.checked,
                                    })
                                }
                            />
                        </span>
                        <span
                            className={'flex gap-2 items-center flex-shrink-0'}
                        >
                            <label>{tokens.UI.manaSlots}:</label>
                            <select
                                className={
                                    'cursor-pointer border border-[#ebebeb] rounded p-0.5 font-Advent bg-background hover:bg-gray-200 hover:text-black outline-0'
                                }
                                onChange={(e) =>
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        manaSlots: Number(
                                            e.target.value,
                                        ) as any,
                                    })
                                }
                                value={currentCharacter.manaSlots}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span className={'flex gap-2 items-center'}>
                            <button
                                type={'button'}
                                className={
                                    'border border-[#ebebeb] rounded p-0.5 min-w-[15mm] hover:bg-gray-200 hover:text-black'
                                }
                                onClick={() => setBackgroundDialogOpened(true)}
                            >
                                {tokens.UI.background}
                            </button>
                            <BackgroundSelectionDialog
                                open={backgroundDialogOpened}
                                onClose={() => setBackgroundDialogOpened(false)}
                            />
                        </span>
                    </>
                )}
            </div>

            <div
                className={
                    'rounded-[2mm] overflow-hidden shadow-highlight w-fit'
                }
            >
                <Sheet printing={printing && printPassives} />
            </div>
        </>
    );
};
