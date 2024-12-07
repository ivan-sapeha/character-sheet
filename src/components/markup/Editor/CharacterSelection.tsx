import trash from '@assets/images/icons/trash.svg';
import { Player } from '@components/ui';
import { Dialog, DialogProps } from '@components/ui/Dialog';
import React from 'react';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const CharacterSelectionDialog: React.FC<DialogProps> = ({
    open,
    onClose,
}) => {
    const {
        addNewCharacter,
        allCharacters,
        setLastCharacter,
        removeCharacter,
    } = useCharacter();

    return (
        <Dialog open={open} onClose={onClose}>
            <div
                className={
                    'flex flex-wrap max-w-[180mm] gap-[5mm] items-center'
                }
            >
                <div
                    className={
                        'w-[40mm] h-[40mm] rounded-full overflow-hidden flex justify-center items-center bg-[#00000099] hover:bg-[#000000aa] text-white text-5xl cursor-pointer hover:border-white'
                    }
                    onClick={() => addNewCharacter()}
                >
                    +
                </div>
                {allCharacters.map((char) => (
                    <div
                        key={char.id}
                        className={
                            'hover:brightness-125 cursor-pointer relative'
                        }
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
        </Dialog>
    );
};
