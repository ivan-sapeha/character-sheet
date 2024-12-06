import trash from '@assets/images/trash.svg';
import { Dialog, DialogProps } from '@components/ui/Dialog';
import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { Passive } from '@components/ui/Statuses/Passives.tsx';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { ImageDBData } from '../../../db';
import { mmToPx } from '../../../helpers/dpi.ts';
import {
    highlightSubString,
    convert1Dto2D,
    splitCamelCase,
} from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { Grid, GridCellRenderer } from 'react-virtualized';
import { usePassives } from '../../../hooks/usePassives.ts';
import styles from './Editor.module.less';
const tableWidth = 670;
const columns = 6;

export const PassivesEditorDialog: React.FC<DialogProps> = ({
    open,
    onClose,
}) => {
    const { passives, removePassive, getPassive } = usePassives();
    const { tokens } = useTranslate();
    const { currentCharacter, updateCurrentCharacter } = useCharacter();
    const [passiveEditorOpen, setPassiveEditorOpen] = useState(false);
    const [selectedPassives, setSelectedPassives] = useState<number[]>(
        currentCharacter.passives ?? [],
    );
    return (
        <Dialog open={open} onClose={onClose}>
            <div className={'flex flex-wrap w-[180mm] gap-[5mm] items-center'}>
                <div className='flex flex-col gap-[3mm] w-full'>
                    <div className='flex gap-[2mm]  bg-[#ffffff77] p-[2mm] rounded-[1.5mm]'>
                        <div className='flex flex-col'>
                            <h2 className='font-Advent'>
                                {tokens.UI.preview}:
                            </h2>
                            <button
                                onClick={() => {
                                    updateCurrentCharacter({
                                        ...currentCharacter,
                                        passives: selectedPassives,
                                    });
                                    onClose();
                                }}
                                className={
                                    'font-Advent border border-black p-[1mm] w-fit rounded bg-white'
                                }
                            >
                                {tokens.UI.save}
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-[2mm]'>
                            {selectedPassives.map((selectedPassive, index) => {
                                const passive = getPassive(selectedPassive);
                                if (!passive) {
                                    return false;
                                }
                                return (
                                    <Passive
                                        key={passive.id}
                                        passive={passive}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedPassives(
                                                selectedPassives.toSpliced(
                                                    index,
                                                    1,
                                                ),
                                            );
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <h1 className='font-Advent flex justify-center'>
                        <span className='border-black border-b border-t w-[60%] block  text-center'>
                            {tokens.UI.passivesGallery}
                        </span>
                    </h1>
                    <div className='flex gap-[2mm] flex-wrap  bg-[#ffffff77] p-[2mm] rounded-[1.5mm]'>
                        <button
                            onClick={() => setPassiveEditorOpen(true)}
                            className='border border-black bg-white rounded-[1.5mm] pt-[0.5mm] pb-[0.5mm] pl-[2mm] pr-[2mm] font-Advent'
                        >
                            {tokens.UI.addPassive}
                        </button>
                        {passives.map((passive) => (
                            <div className='relative' key={passive.id}>
                                <Passive
                                    className={cx('cursor-copy', {
                                        'bg-[#ffe1b7] !cursor-pointer':
                                            selectedPassives.includes(
                                                passive.id,
                                            ),
                                    })}
                                    passive={passive}
                                    onClick={() => {
                                        if (
                                            !selectedPassives.includes(
                                                passive.id,
                                            )
                                        ) {
                                            setSelectedPassives(
                                                selectedPassives.concat(
                                                    passive.id,
                                                ),
                                            );
                                        } else {
                                            setSelectedPassives(
                                                selectedPassives.toSpliced(
                                                    selectedPassives.findIndex(
                                                        (id) =>
                                                            passive.id == id,
                                                    ),
                                                    1,
                                                ),
                                            );
                                        }
                                    }}
                                />
                                <img
                                    src={trash}
                                    className={
                                        'w-[3mm] absolute top-[-4mm] right-[-4mm] p-[2mm] box-content cursor-pointer invert hover:invert-0'
                                    }
                                    onClick={() => {
                                        removePassive(passive.id);
                                        if (
                                            selectedPassives.includes(
                                                passive.id,
                                            )
                                        ) {
                                            setSelectedPassives(
                                                selectedPassives.toSpliced(
                                                    selectedPassives.findIndex(
                                                        (selectedPassive) =>
                                                            passive.id ===
                                                            selectedPassive,
                                                    ),
                                                    1,
                                                ),
                                            );
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {passiveEditorOpen && (
                <PassiveCreatorDialog
                    open={passiveEditorOpen}
                    onClose={() => setPassiveEditorOpen(false)}
                />
            )}
        </Dialog>
    );
};

export const PassiveCreatorDialog: React.FC<DialogProps> = ({
    open,
    onClose,
}) => {
    const { tokens } = useTranslate();
    const { addPassive } = usePassives();
    const [filter, setFilter] = useState('');
    const [passiveName, setPassiveName] = useState(tokens.UI.defaultPassive);
    const [icons, setIcons] = useState<ImageDBData[]>([]);
    const [selectedIcon, setSelectedIcon] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const { getAll } = useIndexedDB('icon');
    const filteredIcons = convert1Dto2D(
        icons.filter((icon) =>
            icon.name
                .toLowerCase()
                .includes(filter.toLowerCase().replaceAll(' ', '')),
        ),
        columns,
    );

    const cellRenderer: GridCellRenderer = ({
        columnIndex,
        key,
        rowIndex,
        style,
    }) => {
        return (
            filteredIcons[rowIndex][columnIndex] && (
                <div
                    key={key}
                    className={cx(
                        'flex flex-col items-center cursor-pointer',
                        styles.highlight,
                    )}
                    style={style}
                    onClick={() =>
                        setSelectedIcon(filteredIcons[rowIndex][columnIndex].id)
                    }
                >
                    <img
                        src={
                            filteredIcons[rowIndex][columnIndex].image as string
                        }
                        className='w-[10mm]'
                    />
                    <span className='font-Advent font-light text-center'>
                        {highlightSubString(
                            splitCamelCase(
                                filteredIcons[rowIndex][columnIndex].name,
                            ),
                            filter,
                            '#69212c',
                        )}
                    </span>
                </div>
            )
        );
    };
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            getAll<ImageDBData>().then((icns) => {
                setIcons(icns);
                setIsLoading(false);
            });
        } else {
            setIcons([]);
        }
    }, [open]);
    return (
        <Dialog open={open} onClose={onClose}>
            {isLoading && <span>Please wait</span>}
            {!isLoading && (
                <div className='flex flex-col gap-[2mm]'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-[2mm]'>
                            <span className='font-Advent'>
                                {tokens.UI.passiveName}:
                            </span>
                            <TextInput
                                placeholder={tokens.UI.passiveName}
                                value={passiveName}
                                maxLength={40}
                                onChange={(val) => setPassiveName(val)}
                            />
                        </div>
                        <div className='flex items-center gap-[2mm]'>
                            <h2 className='font-Advent'>
                                {tokens.UI.preview}:
                            </h2>{' '}
                            <Passive
                                passive={{
                                    id: -1,
                                    name: passiveName,
                                    icon: selectedIcon,
                                }}
                                className='bg-[#ffffff77]'
                            />
                        </div>
                        <div className='flex'>
                            <button
                                onClick={() => {
                                    addPassive({
                                        name: passiveName,
                                        icon: selectedIcon,
                                    });
                                    onClose();
                                }}
                                className={
                                    'font-Advent border border-black p-[1mm] w-fit rounded bg-white'
                                }
                            >
                                {tokens.UI.save}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[5mm]'>
                        <TextInput
                            placeholder={tokens.UI.search}
                            value={filter}
                            onChange={(val) => setFilter(val)}
                        />

                        <Grid
                            cellRenderer={cellRenderer}
                            columnCount={
                                filteredIcons[0] ? filteredIcons[0].length : 0
                            }
                            columnWidth={tableWidth / columns}
                            height={500 - mmToPx(21)}
                            rowCount={filteredIcons.length}
                            rowHeight={90}
                            width={tableWidth}
                            style={{ overflowX: 'hidden' }}
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
};