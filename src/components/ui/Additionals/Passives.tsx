import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { ImageDBData } from '../../../db';
import { reactJoin } from '../../../helpers/generic-helpers.tsx';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { PassiveData, usePassives } from '../../../hooks/usePassives.ts';

export const PassiveDescriptions = () => {
    const { getPassivesInOrder } = usePassives();
    const { currentCharacter } = useCharacter();
    const usablePassives = getPassivesInOrder(currentCharacter.passives).filter(
        (passive) => !!passive.description,
    );

    return (
        <div className={'w-[210mm] bg-white p-[2mm]'}>
            <div className='flex flex-col w-full'>
                {usablePassives.map((passive) => (
                    <div
                        key={generateUUID()}
                        className='pt-[2mm] break-inside-avoid'
                    >
                        <PassiveDescription passive={passive} />
                    </div>
                ))}
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
        <div className='flex flex-col p-[2mm] border rounded-[2mm] border-gray-800 bg-white w-full overflow-hidden overflow-ellipsis'>
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
