import { baseStats, Character } from '../constants/char.ts';
import { clone, keys } from './generic-helpers.tsx';

export const getModifier = (score: number) => Math.floor((score - 10) / 2);

export const mergeStats = (
    character: Character,
    statName: keyof Character['stats'],
): Character['stats'][keyof Character['stats']] => {
    const stat = character.stats[statName];
    const statModifier = getModifier(stat.value);
    const result = clone(baseStats[statName]);
    if (result.checks) {
        keys(result.checks).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            result.checks![key] =
                statModifier +
                Number(stat?.checks ? stat?.checks[key] ?? 0 : 0);
        });
    }
    return { ...stat, checks: result.checks };
};
