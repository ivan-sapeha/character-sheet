import agi from '@assets/images/preprocessed/agi-hd-transparent.png';
import char from '@assets/images/preprocessed/charisma-hd-transparent.png';
import cons from '@assets/images/preprocessed/const-hd-transparent.png';
import int from '@assets/images/preprocessed/int-hd-transparent.png';
import str from '@assets/images/preprocessed/str-hd-transparent.png';
import wis from '@assets/images/preprocessed/wis-hd-transparent.png';

export type Stat = {
    value: number;
    save?: number;
};

export type StrengthStat = Stat & {
    checks?: {
        athletics?: number;
    };
};

export type ConstitutionStat = Stat & {
    checks?: undefined;
};
export type DexterityStat = Stat & {
    checks?: {
        acrobatics?: number;
        stealth?: number;
        sleightOfHand?: number;
    };
};
export type IntelligenceStat = Stat & {
    checks?: {
        history?: number;
        arcana?: number;
        investigation?: number;
        nature?: number;
        religion?: number;
    };
};

export type WisdomStat = Stat & {
    checks?: {
        insight?: number;
        survival?: number;
        animalHandling?: number;
        medicine?: number;
        perception?: number;
    };
};

export type CharismaStat = Stat & {
    checks?: {
        persuasion?: number;
        intimidation?: number;
        performance?: number;
        deception?: number;
    };
};

export enum HPDice {
    d6 = 'd6',
    d8 = 'd8',
    d10 = 'd10',
    d12 = 'd12',
}

export type Character = {
    id: number;
    name: string;
    surname: string;
    dice: HPDice;
    manaTracker: boolean;
    manaSlots: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    passives: number[];
    race: string;
    class: string;
    age: string;
    height: string;
    weight: string;
    background: string;
    languages: string;
    photo: number;
    backgroundImage: number;
    stats: {
        strength: StrengthStat;
        constitution: ConstitutionStat;
        dexterity: DexterityStat;
        intelligence: IntelligenceStat;
        wisdom: WisdomStat;
        charisma: CharismaStat;
    };
    lvl: string;
    walk: string;
    run: string;
    climb: string;
    swim: string;
    mount: string;
    initiative: string;
    proficiency: string;
    perception: string;
    inspiration: string;
    cp: string;
    sp: string;
    gp: string;
    ep: string;
    pp: string;
    success: 0 | 1 | 2 | 3;
    fail: 0 | 1 | 2 | 3;
};
export const baseStats: Character['stats'] = {
    strength: {
        value: 10,
        save: 0,
        checks: {
            athletics: 0,
        },
    },
    constitution: {
        value: 10,
        save: 0,
        checks: undefined,
    },
    dexterity: {
        value: 10,
        save: 0,
        checks: {
            acrobatics: 0,
            stealth: 0,
            sleightOfHand: 0,
        },
    },
    intelligence: {
        value: 10,
        save: 0,
        checks: {
            arcana: 0,
            history: 0,
            investigation: 0,
            nature: 0,
            religion: 0,
        },
    },
    wisdom: {
        value: 10,
        save: 0,
        checks: {
            animalHandling: 0,
            insight: 0,
            medicine: 0,
            perception: 0,
            survival: 0,
        },
    },
    charisma: {
        value: 10,
        save: 0,
        checks: {
            deception: 0,
            intimidation: 0,
            performance: 0,
            persuasion: 0,
        },
    },
};
export const statOrder = [
    'strength',
    'constitution',
    'dexterity',
    'intelligence',
    'wisdom',
    'charisma',
] as const;

export const statHelpers: {
    [key in keyof Character['stats']]: { color: string; icon: string };
} = {
    strength: {
        icon: str,
        color: '#790000',
    },
    constitution: {
        icon: cons,
        color: '#7a4501',
    },
    dexterity: {
        icon: agi,
        color: '#005705',
    },
    intelligence: {
        icon: int,
        color: '#003d64',
    },
    wisdom: {
        icon: wis,
        color: '#4b0075',
    },
    charisma: {
        icon: char,
        color: '#770071',
    },
};

export const emptyCharacter: Character = {
    id: -1,
    dice: HPDice.d8,
    name: '',
    surname: '',
    photo: -1,
    backgroundImage: -1,
    stats: baseStats,
    lvl: '',
    manaSlots: 4,
    manaTracker: false,
    passives: [],
    race: '',
    class: '',
    age: '',
    height: '',
    weight: '',
    background: '',
    languages: '',
    walk: '',
    run: '',
    climb: '',
    swim: '',
    mount: '',
    initiative: '',
    proficiency: '',
    perception: '',
    inspiration: '',
    cp: '',
    sp: '',
    gp: '',
    ep: '',
    pp: '',
    success: 0,
    fail: 0,
};
