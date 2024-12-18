import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Dialog } from '@components/ui/Dialog';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Character } from '../../../constants/char.ts';
import { fileToB64 } from '../../../helpers/convert.ts';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import trash from '@assets/images/icons/trash.svg';

interface AvatarDialogProps {
    dialogOpened: boolean;
    setDialogOpened: (open: boolean) => void;
    character: Character;
}

export const AvatarDialog: React.FC<AvatarDialogProps> = ({
    dialogOpened,
    setDialogOpened,
    character,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { add, getAll, deleteRecord } = useIndexedDB('avatar');
    const { updateCurrentCharacter } = useCharacter();
    const [update, setUpdate] = useState(generateUUID());
    const [allImages, setAllImages] = useState<
        { image: string; id: number; name: string }[]
    >([]);

    const onAvatarAdd: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const fileHandle = event.target.files![0];
        if (fileHandle) {
            const file = fileHandle;
            const b64 = await fileToB64(file);
            await add({ name: file.name, image: b64 });
            inputRef.current!.value = '';
            setUpdate(generateUUID());
        }
    };

    const onAvatarRemove = async (imageId: number) => {
        await deleteRecord(imageId);
        setUpdate(generateUUID());
    };

    const onAvatarSelect = (imageId: number) => {
        updateCurrentCharacter({
            ...character,
            photo: imageId,
        });
        setDialogOpened(false);
    };

    useEffect(() => {
        (async () => {
            const allImages = await getAll<{
                image: string;
                id: number;
                name: string;
            }>();
            setAllImages(
                allImages.map((image) => ({
                    name: image.name,
                    id: image.id,
                    image: `url('${image.image}')`,
                })),
            );
        })();
    }, [update]);

    return (
        <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
            <div className={'flex flex-wrap max-w-[120mm] gap-[3mm]'}>
                <div
                    className={
                        'w-[25mm] aspect-square rounded-full overflow-hidden flex justify-center items-center bg-[#00000099] hover:bg-[#000000aa] text-white text-5xl cursor-pointer'
                    }
                    onClick={() => inputRef.current!.click()}
                >
                    <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={onAvatarAdd}
                        ref={inputRef}
                    />
                    +
                </div>
                {allImages.map((image) => (
                    <div className={'relative'} key={image.id}>
                        <div
                            className={
                                'w-[25mm] aspect-square rounded-full overflow-hidden hover:brightness-150'
                            }
                        >
                            <div
                                style={{
                                    backgroundImage: image.image,
                                    backgroundSize: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onAvatarSelect(image.id)}
                            />
                        </div>
                        <img
                            src={trash}
                            className={
                                'w-[4mm] absolute top-0 right-0 p-[2mm] box-content cursor-pointer hover:invert'
                            }
                            onClick={() => onAvatarRemove(image.id)}
                        />
                    </div>
                ))}
            </div>
        </Dialog>
    );
};
