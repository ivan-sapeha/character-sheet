import { PassivesEditorDialog } from '@components/markup/Editor/PassivesEditor.tsx';
import { PassiveDescription } from '@components/ui/Additionals/Passives.tsx';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { ImageDBData } from '../../../db';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { PassiveData, usePassives } from '../../../hooks/usePassives.ts';
import { isMobile } from 'react-device-detect';
import styles from './Statuses.module.less';
export const Passives = () => {
    const { tokens } = useTranslate();
    const { isEdit, currentCharacter } = useCharacter();
    const { getPassivesInOrder } = usePassives();
    const [dialogOpened, setDialogOpened] = useState(false);

    return (
        <>
            <div
                className={cx(styles.container, styles.passives, {
                    [styles.canActivate]: isEdit,
                })}
                onClick={() => {
                    if (isEdit) {
                        setDialogOpened(true);
                    }
                }}
            >
                <h1 className={styles.header}>{tokens.UI.passives}</h1>
                <div className={styles.statuses}>
                    {getPassivesInOrder(currentCharacter.passives ?? []).map(
                        (passive) => (
                            <div
                                key={passive!.id}
                                className={cx(styles.passive, {
                                    '!static': isMobile,
                                })}
                            >
                                <Passive
                                    passive={passive!}
                                    className={cx({ 'select-none': isMobile })}
                                    canShowDescription={!isEdit}
                                />
                            </div>
                        ),
                    )}
                </div>
            </div>
            {isEdit && (
                <PassivesEditorDialog
                    open={dialogOpened}
                    onClose={() => {
                        setDialogOpened(false);
                    }}
                />
            )}
        </>
    );
};

export const Passive: React.FC<{
    passive: PassiveData;
    onClick?: () => void;
    className?: string;
    canShowDescription?: boolean;
}> = ({ passive, onClick, className, canShowDescription = false }) => {
    const { getByID } = useIndexedDB('icon');
    const [iconSrc, setIconSrc] = useState('');
    useEffect(() => {
        if (passive.icon === -1) {
            return;
        }
        getByID<ImageDBData>(passive.icon).then((icon) =>
            setIconSrc(icon.image as string),
        );
    }, [passive]);
    return (
        <div className={cx(styles.status, className)} onClick={onClick}>
            {passive.icon !== -1 && iconSrc && (
                <img src={iconSrc} style={{ height: '7mm', aspectRatio: 1 }} />
            )}
            {passive.name}
            {canShowDescription && !!passive.description && (
                <div
                    className={cx(
                        styles.passiveDescription,
                        passive.description ? 'w-[105mm]' : 'w-fit',
                        { 'left-0 w-full': isMobile },
                    )}
                >
                    <PassiveDescription passive={passive} />
                </div>
            )}
        </div>
    );
};
