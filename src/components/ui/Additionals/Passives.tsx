import cx from 'classnames';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { ImageDBData } from '../../../db';
import { mmToPx } from '../../../helpers/dpi.ts';
import { reactJoin } from '../../../helpers/generic-helpers.tsx';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { PassiveData, usePassives } from '../../../hooks/usePassives.ts';

const a4Height = mmToPx(297);
export const PassiveDescriptions = () => {
    const { getPassivesInOrder } = usePassives();
    const { currentCharacter } = useCharacter();
    const usablePassives = getPassivesInOrder(currentCharacter.passives).filter(
        (passive) => !!passive.description,
    );
    const ref = useRef<HTMLDivElement>(null);
    const [passives, setPassives] = useState<ReactElement[]>([]);
    const [lastHeight, setLastHeight] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        /* This is the mechanism to space out passive description in case when it will be split into two pages */
        const newPassiveIndex = passives.length - page + 1;
        if (usablePassives.length >= newPassiveIndex) {
            const newPassive = usablePassives[newPassiveIndex];
            const currentHeight = ref.current?.offsetHeight ?? 0;
            setLastHeight(currentHeight);
            if (currentHeight < a4Height * page && newPassive) {
                setPassives([
                    ...passives,
                    <PassiveDescription
                        key={newPassive.id}
                        passive={newPassive}
                    />,
                ]);
            } else if (currentHeight >= a4Height * page) {
                const isEnd = !usablePassives[newPassiveIndex];
                const lastPassive = passives.pop()!;
                !isEnd && setPage((page) => page + 1);
                const componentHeight = currentHeight - lastHeight;
                const overflowHeight = currentHeight - a4Height * page;
                setPassives([
                    ...passives,
                    <Spacer
                        key={generateUUID()}
                        height={componentHeight - overflowHeight}
                    />,
                    lastPassive,
                ]);
            }
        }
    }, [passives]);
    return (
        <div className={'w-[210mm] bg-white p-[2mm]'}>
            <div className='flex flex-col gap-[2mm] w-full' ref={ref}>
                {passives}
            </div>
        </div>
    );
};

export const PassiveDescription: React.FC<{ passive: PassiveData }> = ({
    passive,
}) => {
    const { getByID } = useIndexedDB('icon');

    const [icon, setIcon] = useState('');
    useEffect(() => {
        getByID<ImageDBData>(passive.icon).then(
            (data) => data?.image && setIcon(data?.image as string),
        );
    }, [passive]);

    return (
        <div
            key={passive.name}
            className='flex flex-col p-[2mm] border rounded-[2mm] border-gray-800 bg-white w-full max-w-[202mm] overflow-hidden overflow-ellipsis'
        >
            <div
                className={cx('flex items-center justify-between', {
                    ' border-b-[1px] border-b-gray-800': passive.description,
                })}
            >
                <span className='flex items-center gap-[2mm]'>
                    {icon && (
                        <span className='h-[8mm] w-[8mm]'>
                            <img className='h-full aspect-square' src={icon} />
                        </span>
                    )}{' '}
                    <h1>{passive.name}</h1>
                </span>
            </div>
            {passive.description && (
                <div className='font-Advent font-light'>
                    {reactJoin(
                        passive.description
                            .split('\n')
                            .map((text) =>
                                text.replace(/[ ]{2,}/g, (match) =>
                                    '\u00A0'.repeat(match.length),
                                ),
                            ),
                        <br />,
                    )}
                </div>
            )}
        </div>
    );
};

const Spacer: React.FC<{ height: number }> = ({ height }) => (
    <div style={{ height }} />
);
