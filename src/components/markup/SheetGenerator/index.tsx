import { Sheet } from '@components/markup/CharacterSheet/Sheet.tsx';
import { BackgroundSelectionDialog } from '@components/markup/Editor/BackgroundSelection.tsx';
import { CharacterSelectionDialog } from '@components/markup/Editor/CharacterSelection.tsx';
import {
    PrintDialog,
    printStorageKey,
} from '@components/markup/Editor/PrintDialog.tsx';
import { SpellsDialog } from '@components/markup/Editor/Spells.tsx';
import { FloatingActionButton } from '@components/ui/FAB/FloatingActionButton.tsx';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useLocalStorage } from 'usehooks-ts';
import { HPDice } from '../../../constants/char.ts';
import { Locale, useTranslate } from '../../../contexts/Translator.tsx';
import { downloadFile, svgToCssUrl } from '../../../helpers/convert.ts';
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
import {
    rand,
    print,
    changeCharacter,
    download,
    edit,
    save,
} from './menu-icons.ts';
import styles from './Sheet.module.less';

let ranOnce = false;
export const SheetGenerator = () => {
    const {
        isEdit,
        toggleEdit,
        setIsPrinting,
        currentCharacter,
        updateCurrentCharacter,
        saveCharacter,
        lastSelectedCharacter,
        exportCharacter,
    } = useCharacter();
    const { tokens, load, availableLanguages, currentLocale } = useTranslate();
    const [randomNames, setRandomNames] = useState<{
        names: string[];
        surnames: string[];
    }>({ names: [], surnames: [] });
    const [versions, setVersions] = useLocalStorage('versions', {
        spells: 0,
    });
    const [printDialogOpened, setPrintDialogOpened] = useState(false);
    const [backgroundDialogOpened, setBackgroundDialogOpened] = useState(false);
    const [spellsDialogOpened, setSpellsDialogOpened] = useState(false);
    const [characterDialogOpened, setCharacterDialogOpened] = useState(false);
    const [iconsProgress, setIconsProgress] = useState(0);
    const langs = keys(availableLanguages);

    const [spellsProgress, setSpellsProgress] = useState<number[]>(
        Array(langs.length).fill(0),
    );
    const [backgroundsProgress, setBackgroundsProgress] = useState(0);

    const { getAll: getAllBackgrounds, add: addBackground } =
        useIndexedDB('background');
    const { getAll: getAllIcons, add: addIcon } = useIndexedDB('icon');
    const {
        getAll: getAllSpells,
        add: addSpells,
        clear,
    } = useIndexedDB('spells');
    const [printPassives, setPrintPassives] = useLocalStorage(
        'print-passives',
        false,
    );
    const onPrint = async () => {
        if (localStorage.getItem(printStorageKey) || printDialogOpened) {
            setIsPrinting(true);
            await skipEventLoopTimes(200 + currentCharacter.spells.length * 15);
            printContent(
                document.getElementsByClassName('print')[0] as HTMLDivElement,
                `${currentCharacter.name}_${currentCharacter.surname}`,
            );
            setIsPrinting(false);
        } else {
            setIsPrinting(true);
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

        async function fetchBackgrounds(maxProgress: number) {
            const backgrounds = await getAllBackgrounds();

            const backgroundNames = backgrounds.map((bg) => bg.name);
            const backgroundsRes =
                await fetchWithHandling<string[]>('backgrounds.json');

            const missingBackgrounds = backgroundsRes.filter(
                (name) => !backgroundNames.includes(name),
            );
            if (missingBackgrounds.length === 0) {
                setBackgroundsProgress(maxProgress);
                return;
            }

            const loadCoefficient = maxProgress / missingBackgrounds.length;
            const load = missingBackgrounds.map((link) =>
                fetchWithHandling<Blob>(link, {
                    responseType: 'blob',
                }).then(async (data) => {
                    setBackgroundsProgress(
                        (progress) => progress + loadCoefficient,
                    );
                    return { name: link, image: data };
                }),
            );

            const images = await Promise.all(load);
            images.forEach((image) => addBackground(image));
        }

        async function fetchIcons(maxProgress: number) {
            {
                const icons = await getAllIcons();
                if (icons.length > 0) {
                    setIconsProgress(maxProgress);
                    return;
                }
            }

            const res = await fetchWithHandling<{
                template: string;
                icons: Record<string, string>;
            }>('icons.json', {
                onDownloadProgress: (data) => {
                    const progress = Number(
                        data.loaded / autogeneratedValues.iconsSize,
                    );
                    setIconsProgress(
                        Math.min(
                            (Number.isNaN(progress) ? 1 : progress) *
                                maxProgress *
                                0.8,
                            maxProgress * 0.8,
                        ),
                    );
                },
            });

            const { template, icons } = res;
            await Promise.all(
                entries(icons).map(([name, path]) => {
                    const icon = {
                        name,
                        image: svgToCssUrl(template.replace('{path}', path)),
                    };
                    return addIcon(icon);
                }),
            );

            setIconsProgress(maxProgress);
        }

        async function fetchSpells(maxProgress: number) {
            {
                const spells = await getAllSpells();
                if (spells.length > 0) {
                    const loadedVersions = await fetchWithHandling<{
                        spells: number;
                    }>('versions.json');
                    if (
                        JSON.stringify(loadedVersions.spells) ===
                        JSON.stringify(versions.spells)
                    ) {
                        setSpellsProgress((spellProgress) =>
                            spellProgress.map(
                                (_) => maxProgress / spellProgress.length,
                            ),
                        );
                        return;
                    } else {
                        setVersions(loadedVersions);
                        await clear();
                    }
                }
            }
            await Promise.all(
                langs.map(async (lang, index) => {
                    const res = await fetchWithHandling<Blob>(
                        `spells/${lang}.msgpack`,
                        {
                            responseType: 'blob',
                            onDownloadProgress: (data) => {
                                const progress = Number(
                                    data.loaded /
                                        autogeneratedValues.spells[lang],
                                );
                                setSpellsProgress((spellsProgress) =>
                                    spellsProgress.toSpliced(
                                        index,
                                        1,
                                        Math.min(
                                            (Number.isNaN(progress)
                                                ? 1
                                                : progress *
                                                  (maxProgress /
                                                      spellsProgress.length),
                                            maxProgress /
                                                spellsProgress.length),
                                        ),
                                    ),
                                );
                            },
                        },
                    );
                    const data = new Uint8Array(await res.arrayBuffer());
                    await addSpells({
                        lang,
                        data,
                    });
                }),
            );

            setSpellsProgress((spellProgress) =>
                spellProgress.map((_) => maxProgress / spellProgress.length),
            );
        }

        const maxProgress = 100 / 3;
        fetchBackgrounds(maxProgress);
        fetchIcons(maxProgress);
        fetchSpells(maxProgress);
    }, []);
    const progress = Math.min(
        iconsProgress +
            backgroundsProgress +
            spellsProgress.reduce((acc, item) => acc + item),
        100,
    );

    const editButton = (
        <button
            className={
                'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[25mm] hover:bg-gray-200 hover:text-black small:min-w-fit small:hover:bg-transparent'
            }
            onClick={onEditClick}
        >
            <span className={'small:hidden'}>
                {isEdit ? tokens.UI.save : tokens.UI.edit}
            </span>
            <img
                src={isEdit ? save : edit}
                className={cx('hidden small:inline')}
                alt={isEdit ? tokens.UI.save : tokens.UI.edit}
            />
        </button>
    );
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
                    Please dont refresh/close this page.
                </span>
            </div>
        );
    }
    return (
        <div className={styles.printContainer}>
            <div
                className={cx(
                    'flex gap-2 p-2.5 w-fit text-[#ebebeb] flex-wrap max-w-[210mm] justify-center pb-4',
                    {
                        'small:flex-col ': isEdit,
                    },
                )}
            >
                {editButton}
                {isMobile && (
                    <FloatingActionButton
                        scrollThreshold={isEdit ? 410 : 60}
                        className={
                            'fixed z-[10000000] bg-background left-[0.625rem] top-[0.625rem] rounded'
                        }
                    >
                        {editButton}
                    </FloatingActionButton>
                )}
                {!isEdit && (
                    <>
                        <span
                            className={
                                'flex gap-2 items-center justify-between flex-shrink-0 small:hidden border border-[#ebebeb] pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] rounded'
                            }
                        >
                            <label
                                className={'cursor-pointer'}
                                htmlFor={'print-passives'}
                            >
                                {tokens.UI.printPassives}:
                            </label>
                            <input
                                id={'print-passives'}
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm]'
                                }
                                checked={printPassives}
                                onChange={(e) =>
                                    setPrintPassives(e.target.checked)
                                }
                            />
                        </span>
                        <div
                            className={
                                'border border-[#ebebeb] rounded min-w-[33mm] small:hidden'
                            }
                        >
                            <button
                                className={
                                    'border-r border-[#ebebeb] pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[25mm] hover:bg-gray-200 hover:text-black small:min-w-fit small:hover:bg-transparent'
                                }
                                onClick={onPrint}
                            >
                                <span className='small:hidden'>
                                    {tokens.UI.print}
                                </span>
                                <img
                                    src={print}
                                    className={'hidden small:inline'}
                                    alt={tokens.UI.print}
                                />
                            </button>
                            <button
                                className={
                                    'pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[7mm] hover:bg-gray-200 hover:text-black font-Advent small:min-w-fit small:hover:bg-transparent'
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
                                'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[35mm] hover:bg-gray-200 hover:text-black small:min-w-fit small:hover:bg-transparent'
                            }
                            onClick={() => setCharacterDialogOpened(true)}
                        >
                            <span className='small:hidden'>
                                {tokens.UI.changeCharacter}
                            </span>
                            <img
                                src={changeCharacter}
                                className={'hidden small:inline'}
                                alt={tokens.UI.changeCharacter}
                            />
                        </button>
                        <button
                            className={
                                'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[35mm] hover:bg-gray-200 hover:text-black small:min-w-fit small:hover:bg-transparent'
                            }
                            onClick={async () => {
                                downloadFile(
                                    `${currentCharacter.name || 'Empty'}_${
                                        currentCharacter.surname ?? ''
                                    }`,
                                    JSON.stringify(
                                        await exportCharacter(currentCharacter),
                                    ),
                                );
                            }}
                        >
                            <span className='small:hidden'>
                                {tokens.UI.export}
                            </span>
                            <img
                                src={download}
                                className={'hidden small:inline'}
                                alt={tokens.UI.export}
                            />
                        </button>
                        <span className={'flex gap-2 items-center'}>
                            <select
                                className={
                                    'border border-[#ebebeb] rounded pt-1 pb-1 pr-[2mm] pl-[2mm] font-Advent bg-background hover:bg-gray-200 hover:text-black'
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
                        {characterDialogOpened && (
                            <CharacterSelectionDialog
                                open={characterDialogOpened}
                                onClose={() => setCharacterDialogOpened(false)}
                            />
                        )}
                    </>
                )}
                {isEdit && (
                    <>
                        <span
                            className={
                                'flex gap-2 items-center flex-shrink-0 small:justify-between'
                            }
                        >
                            <label>{tokens.UI.name}:</label>
                            <div className='flex items-center gap-[1mm]'>
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
                                        'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] bg-background hover:bg-gray-200 hover:text-black focus:bg-gray-200 focus:text-black outline-0 font-Advent w-[105px]'
                                    }
                                    value={currentCharacter.name}
                                    onChange={(e) =>
                                        updateCurrentCharacter({
                                            ...currentCharacter,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
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
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] bg-background hover:bg-gray-200 hover:text-black focus:bg-gray-200 focus:text-black outline-0 font-Advent w-[105px]'
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
                                    'cursor-pointer border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] font-Advent bg-background hover:bg-gray-200 hover:text-black outline-0'
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
                            className={
                                'flex gap-2 items-center justify-between flex-shrink-0 border border-[#ebebeb] pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] rounded'
                            }
                        >
                            <label
                                className={'cursor-pointer'}
                                htmlFor={'show-lore'}
                            >
                                {tokens.UI.showLore}:
                            </label>
                            <input
                                id={'show-lore'}
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm]'
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
                            className={
                                'flex gap-2 items-center justify-between flex-shrink-0 border border-[#ebebeb] pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] rounded'
                            }
                        >
                            <label
                                className={'cursor-pointer'}
                                htmlFor={'show-speed'}
                            >
                                {tokens.UI.showSpeed}:
                            </label>
                            <input
                                id={'show-speed'}
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm]'
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
                            className={
                                'flex gap-2 items-center justify-between flex-shrink-0 border border-[#ebebeb] pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] rounded'
                            }
                        >
                            <label
                                className={'cursor-pointer'}
                                htmlFor={'mana-tracker'}
                            >
                                {tokens.UI.manaTracker}:
                            </label>
                            <input
                                id={'mana-tracker'}
                                type='checkbox'
                                className={
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm]'
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
                                    'cursor-pointer border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] font-Advent bg-background hover:bg-gray-200 hover:text-black outline-0'
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
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[15mm] hover:bg-gray-200 hover:text-black'
                                }
                                onClick={() => setBackgroundDialogOpened(true)}
                            >
                                {tokens.UI.background}
                            </button>
                            {backgroundDialogOpened && (
                                <BackgroundSelectionDialog
                                    open={backgroundDialogOpened}
                                    onClose={() =>
                                        setBackgroundDialogOpened(false)
                                    }
                                />
                            )}
                        </span>
                        <span className={'flex gap-2 items-center'}>
                            <button
                                type={'button'}
                                className={
                                    'border border-[#ebebeb] rounded pt-0.5 pb-0.5 pr-[2mm] pl-[2mm] min-w-[15mm] hover:bg-gray-200 hover:text-black'
                                }
                                onClick={() => setSpellsDialogOpened(true)}
                            >
                                {tokens.UI.spells}
                            </button>
                            {spellsDialogOpened && (
                                <SpellsDialog
                                    open={spellsDialogOpened}
                                    onClose={() => setSpellsDialogOpened(false)}
                                />
                            )}
                        </span>
                    </>
                )}
            </div>

            <div
                className={cx(
                    'overflow-hidden shadow-highlight w-fit small:scale-small',
                    {
                        'rounded-[2mm] ': !isMobile,
                        '!overflow-visible': isEdit,
                    },
                )}
            >
                <Sheet />
            </div>
        </div>
    );
};
