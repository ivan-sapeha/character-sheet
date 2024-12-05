import { SpellData } from '@components/ui/Additionals/Spell.tsx';
import cx from 'classnames';
import { logger } from 'html2canvas/dist/types/core/__mocks__/logger';
import React, { useEffect, useRef, useState } from 'react';
import { generateUUID } from '../../../helpers/uuid.ts';
import styles from './SpellCard.module.less';

function splitString(input: string): string[] {
    // Regular expression to match the pattern
    const regex = /^(.*?)(?:\s*\((.*)\))?$/;
    const match = input.match(regex);

    if (match) {
        // If there is a match, return the appropriate groups
        const part1 = match[1].trim();
        const part2 = match[2]?.trim();

        if (part2) {
            return [part1, part2];
        } else {
            return [part1];
        }
    }
    return [input];
}

const minLineHeight = 0.8;
const maxLineHeight = 2.8;
const minFontSize = 8;
const maxFontSize = 12;
const statsHeight = 76;
export const SpellCard: React.FC<{ data: SpellData }> = ({ data }) => {
    const splitComponents = splitString(data.components);
    const [lineHeight, setLineHeight] = useState(maxLineHeight);
    const [fontSize, setFontSize] = useState(maxFontSize);
    const descriptionSize = 255;
    const castTimeSize = 20;
    const descriptionContainer = useRef<HTMLDivElement>(null);
    const castTimeContainer = useRef<HTMLDivElement>(null);
    const statsContainer = useRef<HTMLDivElement>(null);
    const componentsContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (
            descriptionContainer.current &&
            statsContainer.current &&
            descriptionContainer.current.offsetHeight +
                componentsContainer.current!.offsetHeight +
                4 +
                statsContainer.current.offsetHeight -
                statsHeight >
                descriptionSize &&
            lineHeight !== minLineHeight
        ) {
            setLineHeight(Math.max(minLineHeight, lineHeight - 0.01));
        }
    }, [lineHeight]);

    useEffect(() => {
        if (
            castTimeContainer.current &&
            castTimeContainer.current.offsetHeight > castTimeSize &&
            fontSize !== minFontSize
        ) {
            setFontSize(Math.max(minFontSize, fontSize - 0.1));
        }
    }, [fontSize]);

    return (
        <div className={styles.card}>
            <div>
                <h1 className='text-center font-Advent text-[14px] text-white'>
                    <span>{data.name}</span>
                </h1>
                <div className='flex flex-col gap-[1mm]' ref={statsContainer}>
                    <div className={styles.stats}>
                        <span className={cx(styles.stat, styles.statTopLeft)}>
                            <p>Час накладання</p>
                            <p
                                className='font-Advent'
                                ref={castTimeContainer}
                                style={{ fontSize }}
                            >
                                {' '}
                                {data.casting_time}
                            </p>
                        </span>
                        {/*<span className="w-[1px] h-[60%] bg-black"></span>*/}
                        <span className={cx(styles.stat, styles.statTopRight)}>
                            <p>Дистанція</p>
                            <p className='font-Advent'> {data.range}</p>
                        </span>
                    </div>
                    <div className={styles.stats}>
                        <span
                            className={cx(styles.stat, styles.statBottomLeft)}
                        >
                            <p>Тривалість</p>
                            <p className='font-Advent'> {data.duration}</p>
                        </span>
                        {/*<span className="w-[1px] h-[60%] bg-black"></span>*/}
                        <span
                            className={cx(styles.stat, styles.statBottomRight)}
                        >
                            <p>Компоненти</p>
                            <p className='font-Advent'> {splitComponents[0]}</p>
                        </span>
                    </div>
                </div>
                <div className='flex justify-center' ref={componentsContainer}>
                    {splitComponents[1] && (
                        <span
                            className={cx(
                                styles.title,
                                'flex-shrink-0 border-b border-b-white text-white',
                            )}
                        >
                            {splitComponents[1]}
                        </span>
                    )}
                </div>
                <div
                    className='font-Nunito pt-[1mm] text-[10px] bg-white mt-[1mm] rounded-[1.5mm] p-[1mm]'
                    style={{ lineHeight: `${lineHeight}mm` }}
                    ref={descriptionContainer}
                >
                    {data.description
                        .replace(/\n+/gm, '\n')
                        .split('\n')
                        .map((part) => (
                            <p key={generateUUID()}>{part}</p>
                        ))}
                </div>
            </div>
            <span className={cx(styles.bottomText, 'flex-shrink-0 text-white')}>
                {data.type}
            </span>
        </div>
    );
};
