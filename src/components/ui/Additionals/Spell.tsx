import React from 'react';
import { generateUUID } from '../../../helpers/uuid.ts';

export interface SpellData {
    name: string;
    originalName: string;
    type: string;
    casting_time: string;
    range: string;
    components: string;
    duration: string;
    description: string;
}

export const Spell: React.FC<{ data: SpellData }> = ({ data }) => {
    return (
        <div className='flex flex-col p-[2mm] border rounded-[2mm] border-gray-800'>
            <div className="flex items-center justify-between border-b-[1px] border-b-gray-800">
                <div className="flex flex-col gap-[1mm]">
                    <span className="flex items-center">
                        <h1>{ data.name.toUpperCase() }</h1>
                        <code className="font-light">[{ data.originalName }]</code>
                    </span>
                    <i className='font-Advent font-light'>{ data.type }</i>
                </div>
                <div className="flex flex-col gap-[1mm] font-Advent font-light">
                    <span>Час накладання: <span className="font-bold">{ data.casting_time }</span></span>
                    <span>Дистанція: <span className="font-bold">{ data.range }</span></span>
                </div>
                <div className="flex flex-col gap-[1mm] font-Advent font-light max-w-[30%]">
                    <span>Компоненти: <span className="font-bold">{ data.components }</span></span>
                    <span>Тривалість: <span className="font-bold">{ data.duration }</span></span>
                </div>
            </div>
            <div className='font-Advent font-light'>
                {data.description
                    .replace(/\n+/gm, '\n')
                    .split('\n')
                    .map(part=><p key={generateUUID()}>{part}</p>)}
            </div>
        </div>
    );
};
