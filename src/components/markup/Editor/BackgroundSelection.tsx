import trash from '@assets/images/icons/trash.svg';
import { Dialog, DialogProps } from '@components/ui/Dialog';
import cx from 'classnames';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { ImageDBData } from '../../../db';
import { fileToB64 } from '../../../helpers/convert.ts';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Editor.module.less';
export const BackgroundSelectionDialog: React.FC<DialogProps> = ({
    open,
    onClose,
}) => {
    const { updateCurrentCharacter, currentCharacter } = useCharacter();
    const [update, setUpdate] = useState(generateUUID());
    const inputRef = useRef<HTMLInputElement>(null);
    const [backgrounds, setBackgrounds] = useState<ImageDBData[]>([]);
    const { getAll, add, deleteRecord } = useIndexedDB('background');
    const onBackgroundAdd: ChangeEventHandler<HTMLInputElement> = async (
        event,
    ) => {
        const fileHandle = event.target.files![0];
        if (fileHandle) {
            await add({
                name: `char-upload-${fileHandle.name}`
                    .replaceAll('_', '-')
                    .replaceAll(' ', '-'),
                image: fileHandle,
            });
            setUpdate(generateUUID());
            inputRef.current!.value = '';
        }
    };

    useEffect(() => {
        if (open) {
            getAll<ImageDBData>().then((data) => {
                Promise.all(
                    data.map(async (background) => {
                        const image = await fileToB64(background.image as File);
                        return { ...background, image };
                    }),
                ).then((bgs) => {
                    setBackgrounds(bgs);
                });
            });
        } else {
            setBackgrounds([]);
        }
    }, [open, update]);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className={'flex flex-wrap max-w-[180mm] gap-[2mm]'}>
                {backgrounds.length > 0 ? (
                    <div
                        className={cx(
                            styles.card,
                            'bg-[#00000099] hover:bg-[#000000aa] text-white text-5xl flex justify-center items-center',
                        )}
                        onClick={() => inputRef.current!.click()}
                    >
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={onBackgroundAdd}
                            ref={inputRef}
                        />
                        +
                    </div>
                ) : (
                    <h2 className='font-Advent'>
                        Loading backgrounds, please wait
                    </h2>
                )}
                {open &&
                    backgrounds.map((background) => {
                        const splitParts = background.name.split('/');

                        const nameParts =
                            splitParts[splitParts.length - 1].split('.');
                        nameParts.pop();
                        const name = nameParts.join('');
                        return (
                            <div key={background.id} className='relative'>
                                <div
                                    style={{
                                        background: `url(${background.image})`,
                                    }}
                                    className={styles.card}
                                    onClick={() => {
                                        updateCurrentCharacter({
                                            ...currentCharacter,
                                            backgroundImage: background.id,
                                        });
                                        onClose();
                                    }}
                                    aria-label={name.replace(
                                        'char-upload-',
                                        '',
                                    )}
                                />
                                {background.name.includes('char-upload-') && (
                                    <img
                                        src={trash}
                                        className={
                                            'w-[4mm] absolute top-[-4mm] right-[-4mm] p-[2mm] box-content cursor-pointer hover:invert'
                                        }
                                        onClick={() => {
                                            deleteRecord(background.id).then(
                                                () => setUpdate(generateUUID()),
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>
        </Dialog>
    );
};
