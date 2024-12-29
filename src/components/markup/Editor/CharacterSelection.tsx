import trash from '@assets/images/icons/trash.svg';
import { Player } from '@components/ui';
import { Dialog, DialogProps } from '@components/ui/Dialog';
import cx from 'classnames';
import React, { ChangeEventHandler, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const CharacterSelectionDialog: React.FC<DialogProps> = ({
    open,
    onClose,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { tokens } = useTranslate();
    const {
        addNewCharacter,
        allCharacters,
        setLastCharacter,
        removeCharacter,
        importCharacter,
        currentCharacter,
    } = useCharacter();
    const onImport: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const fileHandle = event.target.files![0];
        if (fileHandle) {
            const str = await fileHandle.text();
            const char = await importCharacter(JSON.parse(str));
            addNewCharacter(char);
            inputRef.current!.value = '';
        }
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <div
                className={cx(
                    'flex flex-wrap max-w-[180mm] gap-[5mm] items-center',
                    { 'flex-col': isMobile },
                )}
            >
                <div
                    className={
                        'w-[30mm] aspect-square rounded-full overflow-hidden flex justify-center items-center bg-[#00000099] hover:bg-[#000000aa] text-white text-5xl cursor-pointer hover:border-white'
                    }
                    onClick={() => addNewCharacter()}
                >
                    +
                </div>
                <div
                    className={
                        'w-[30mm] aspect-square rounded-full overflow-hidden flex justify-center items-center bg-[#00000099] hover:bg-[#000000aa] text-white text-5xl cursor-pointer hover:border-white'
                    }
                    onClick={() => inputRef?.current?.click()}
                >
                    {tokens.UI.import}
                </div>
                {allCharacters.map((char) => (
                    <div
                        key={char.id}
                        className={cx(
                            'hover:!brightness-125 hover:!saturate-125 cursor-pointer relative saturate-50',
                            {
                                '!saturate-100': currentCharacter.id == char.id,
                            },
                        )}
                        onClick={() => {
                            setLastCharacter(char.id);
                            onClose();
                        }}
                    >
                        <img
                            src={trash}
                            className={
                                'w-[4mm] absolute top-0 right-[50%] p-[2mm] box-content cursor-pointer translate-x-[50%] hover:invert'
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCharacter(char.id);
                            }}
                        />
                        <Player character={char} isPreview />
                    </div>
                ))}
            </div>
            <input
                type='file'
                accept='application/json'
                className='hidden'
                onChange={onImport}
                ref={inputRef}
            />
        </Dialog>
    );
};
