import styles from '@components/ui/Spells/Spells.module.less';
import cx from 'classnames';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslate } from '../../../contexts/Translator.tsx';
import {
    highlightSubString,
    replaceTextWithTranslation,
} from '../../../helpers/generic-helpers.tsx';

export interface Spell {
    name: string;
    source: string;
    level: number;
    school: string;
    ritual: boolean;
    castingTime: string;
    range: string;
    components: { verbal: boolean; somatic: boolean; material: string | null };
    duration: string;
    description: string[];
    onHighLevels: string | null;
    classes: string[];
    originalName: string;
    id: number;
}

const magicSchoolsByColor = {
    Conjuration: '#66B2B2',
    Abjuration: '#3366CC',
    Evocation: '#CC3333',
    Necromancy: '#339933',
    Transmutation: '#CC9933',
    Enchantment: '#CC99CC',
    Divination: '#9966CC',
    Illusion: '#CCCC33',
};

export interface SpellProps {
    spell: Spell;
    filter?: string;
    selected?: boolean;
    onClick?: (selected: boolean) => void;
    className?: string;
}

export const Spell: React.FC<SpellProps> = ({
    spell,
    filter = '',
    selected = false,
    onClick,
    className,
}) => {
    const color =
        magicSchoolsByColor[spell.school as keyof typeof magicSchoolsByColor];
    const { tokens } = useTranslate();
    return (
        <div
            key={spell.id}
            className={cx(
                styles.spell,
                'flex flex-col border-2 rounded p-2 font-Roboto font-normal',
                { 'bg-white': selected, 'cursor-pointer': onClick },
                className,
            )}
            style={{ borderColor: color }}
            onClick={() => onClick && onClick(!selected)}
        >
            <div
                className='flex justify-between border-b'
                style={{
                    borderColor: color,
                }}
            >
                <h1 className='font-Nunito'>
                    {highlightSubString(spell.name, filter, color)}{' '}
                    {highlightSubString(
                        spell.originalName ? `(${spell.originalName})` : '',
                        filter,
                        color,
                    )}
                </h1>
                <span className='text-right'>
                    {replaceTextWithTranslation(
                        spell.school,
                        tokens.spells.schools,
                    )}
                    ,{' '}
                    {spell.level > 0
                        ? `${spell.level} ${tokens.spells.level}`
                        : tokens.spells.cantrip}
                    {spell.ritual && ` (${tokens.spells.ritual})`}
                </span>
            </div>
            <div
                className='flex justify-between border-b'
                style={{
                    borderColor: color,
                }}
            >
                <div className='flex flex-col'>
                    <span className={cx({ 'flex flex-col': isMobile })}>
                        <span>{tokens.spells.range}:</span>{' '}
                        <strong>{spell.range}</strong>{' '}
                    </span>
                    <span className={cx({ 'flex flex-col': isMobile })}>
                        <span>{tokens.spells.castTime}:</span>{' '}
                        <strong>{spell.castingTime}</strong>{' '}
                    </span>
                    <span className={cx({ 'flex flex-col': isMobile })}>
                        <span>{tokens.spells.duration}:</span>{' '}
                        <strong>{spell.duration}</strong>
                    </span>
                </div>

                <div className='flex flex-col items-end justify-center text-right max-w-[70%]'>
                    <span className={cx({ 'flex flex-col': isMobile })}>
                        <span>{tokens.spells.components}:</span>{' '}
                        <strong>
                            {[
                                spell.components.verbal && tokens.spells.V,
                                spell.components.somatic && tokens.spells.S,
                                spell.components.material && tokens.spells.M,
                            ]
                                .filter(Boolean)
                                .join(', ')}
                        </strong>
                    </span>
                    <span>
                        {spell.components.material &&
                            `(${spell.components.material})`}
                    </span>
                </div>
            </div>
            <div>
                {spell.description.map((descriptionPiece, index) => (
                    <p
                        key={`${spell.name}-${index}`}
                        className='pb-1'
                        style={{
                            borderColor: color,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: descriptionPiece.replace(
                                /\b\d+[dк]\d+\b/g,
                                (dice) => `<strong>${dice}</strong>`,
                            ),
                        }}
                    />
                ))}
            </div>
            {spell.onHighLevels && (
                <div className='pt-[2mm]'>
                    <strong>{tokens.spells.onHigherLevels}:</strong>{' '}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: spell.onHighLevels.replace(
                                /\b\d+[dк]\d+\b/g,
                                (dice) => `<strong>${dice}</strong>`,
                            ),
                        }}
                    />
                </div>
            )}
            <div
                className='flex justify-between border-t'
                style={{
                    borderColor: color,
                }}
            >
                <span>
                    {tokens.spells.source}: <strong>{spell.source}</strong>
                </span>
                <span>
                    {spell.classes
                        .map((clas) =>
                            replaceTextWithTranslation(
                                clas,
                                tokens.spells.classes,
                            ),
                        )
                        .join(', ')}
                </span>
            </div>
        </div>
    );
};
