import { CurvedText } from '@components/ui/CurvedText';
import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Character } from '../../../constants/char.ts';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Player.module.less';
import scroll from '@assets/images/sources/scroll.png';
import troll from '@assets/images/trollface.png';
import { AvatarDialog } from '@components/markup/Editor/Avatar.tsx';

export interface PlayerProps {
    isPreview?: boolean;
    character: Character;
}

export const Player: React.FC<PlayerProps> = ({ isPreview, character }) => {
    const { getByID } = useIndexedDB('avatar');
    const { isEdit } = useCharacter();
    const [dialogOpened, setDialogOpened] = useState(false);
    const [image, setImage] = useState('');
    const isDead = character.fail === 3;
    const onAvatarClick = () => {
        if (!isEdit) {
            return;
        }
        setDialogOpened(true);
    };

    useEffect(() => {
        if (character.photo !== -1) {
            getByID(character.photo).then(
                (data) => data && setImage(`url(${data.image})`),
            );
        } else {
            setImage('');
        }
    }, [character.photo]);
    return (
        <>
            <div
                className={cx(styles.player, { [styles.isPreview]: isPreview })}
            >
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
                                backgroundImage:
                                    image && !isDead
                                        ? image
                                        : isDead
                                          ? `url(${troll})`
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
                                <div className={styles.textPlaceholder}>
                                    <InvisibleInputs stat={'hp'} />
                                </div>
                            </div>
                            <div className={styles.tempHp}>
                                <span
                                    className={cx(
                                        styles.icon,
                                        styles.tempHpIcon,
                                    )}
                                />
                                <div className={styles.textPlaceholder}>
                                    <InvisibleInputs stat={'tempHp'} />
                                </div>
                            </div>
                            <div className={styles.armor}>
                                <span
                                    className={cx(
                                        styles.icon,
                                        styles.armorIcon,
                                    )}
                                />
                                <div className={styles.textPlaceholder}>
                                    <InvisibleInputs stat={'ac'} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {dialogOpened && (
                <AvatarDialog
                    dialogOpened={dialogOpened}
                    setDialogOpened={setDialogOpened}
                    character={character}
                />
            )}
        </>
    );
};

const InvisibleInputs: React.FC<{ stat: 'hp' | 'tempHp' | 'ac' }> = ({
    stat,
}) => {
    const { currentCharacter, updateStatLive } = useCharacter();
    return (
        <>
            <input
                value={currentCharacter[stat]?.current ?? ''}
                className={'font-Advent font-light'}
                type='number'
                onChange={(e) =>
                    updateStatLive(stat, {
                        current: e.target.value,
                        max: currentCharacter[stat]?.max ?? '',
                    })
                }
            />
            <input
                value={currentCharacter[stat]?.max ?? ''}
                className={'font-Advent font-light'}
                type='number'
                onChange={(e) =>
                    updateStatLive(stat, {
                        max: e.target.value,
                        current: currentCharacter[stat]?.current ?? '',
                    })
                }
            />
        </>
    );
};
