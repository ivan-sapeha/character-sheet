import { CurvedText } from '@components/ui/CurvedText';
import { Dialog } from '@components/ui/Dialog';
import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import cx from 'classnames';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Character, emptyCharacter } from '../../../constants/char.ts';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { fileToB64 } from '../../../helpers/convert.ts';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Player.module.less';
import hp from '@assets/images/sources/hp.png';
import tempHp from '@assets/images/sources/tempHp.png';
import armor from '@assets/images/sources/armor.png';
import scroll from '@assets/images/sources/scroll.png';
import trash from '@assets/images/trash.svg';

export interface PlayerProps {
    isPreview?: boolean;
    character: Character;
}

export const Player: React.FC<PlayerProps> = ({ isPreview, character }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { add, getByID, getAll, deleteRecord } = useIndexedDB('avatar');
    const { isEdit, updateCurrentCharacter, currentCharacter } = useCharacter();
    const [update, setUpdate] = useState(generateUUID());
    const onAvatarClick = () => {
        if (!isEdit) {
            return;
        }
        setDialogOpened(true);
    };

    const onAvatarAdd: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const fileHandle = event.target.files![0];
        if (fileHandle) {
            const file = fileHandle;
            const b64 = await fileToB64(file);
            await add({ name: file.name, image: b64 });
            setUpdate(generateUUID());
            inputRef.current!.value = '';
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
    const [dialogOpened, setDialogOpened] = useState(false);
    const [image, setImage] = useState('');
    const [allImages, setAllImages] = useState<
        { image: string; id: number; name: string }[]
    >([]);

    useEffect(() => {
        (async () => {
            const allImages = await getAll<{
                image: string;
                id: number;
                name: string;
            }>();
            setAllImages(allImages);
        })();
        if (character.photo !== -1) {
            getByID(character.photo).then(
                (data) => data && setImage(data.image),
            );
        } else {
            setImage('');
        }
    }, [dialogOpened, character, update]);
    return (
        <>
            <div className={styles.player}>
                <div className={styles.playerCircle}>
                    <div
                        className={cx(styles.playerCircleAvatar, {
                            [styles.edit]: isEdit && !isPreview,
                        })}
                        onClick={onAvatarClick}
                    >
                        <div
                            className={styles.avatar}
                            style={{
                                backgroundImage: image
                                    ? `url(${image})`
                                    : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '100%',
                                width: 'auto',
                            }}
                        />
                    </div>

                    <div className={styles.name}>
                        <img src={scroll} alt='scroll' />
                        <CurvedText text={character.name} side={'left'} />
                    </div>
                    {!isPreview && (
                        <div className={styles.lvl}>
                            <EditableInput
                                stat={'lvl'}
                                className='aspect-square !rounded-full !h-[8mm] !w-[8mm] !p-[0] text-center'
                                type={'number'}
                                min={1}
                            />
                        </div>
                    )}
                    <div className={styles.surname}>
                        <img src={scroll} alt='scroll' />
                        <CurvedText text={character.surname} side={'right'} />
                    </div>
                    {!isPreview && (
                        <div
                            className={styles.bottomBar}
                            style={isEdit ? inactiveStyle : undefined}
                        >
                            <div className={styles.hp}>
                                <span
                                    className={cx(styles.icon, styles.hpIcon)}
                                />
                                <span className={styles.dice}>
                                    {character.dice}
                                </span>
                                <span className={styles.textPlaceholder} />
                            </div>
                            <div className={styles.tempHp}>
                                <span
                                    className={cx(
                                        styles.icon,
                                        styles.tempHpIcon,
                                    )}
                                />
                                <span className={styles.textPlaceholder} />
                            </div>
                            <div className={styles.armor}>
                                <span
                                    className={cx(
                                        styles.icon,
                                        styles.armorIcon,
                                    )}
                                />
                                <span className={styles.textPlaceholder} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
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
                                        backgroundImage: `url('${image.image}')`,
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
        </>
    );
};
