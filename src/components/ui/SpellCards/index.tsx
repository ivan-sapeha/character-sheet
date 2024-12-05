import { BackCover } from '@components/ui/SpellCards/BackCover.tsx';
import styles from './SpellCard.module.less';
import { A4Sheet } from '@components/ui';
import { SpellData } from '@components/ui/Additionals/Spell.tsx';
import { SpellCard } from '@components/ui/SpellCards/SpellCard.tsx';
import React, { useMemo } from 'react';

const splitPerPage = (spells: SpellData[], n = 9) => {
    return new Array(Math.ceil(spells.length / n))
        .fill(0)
        .map((_, index) => spells.slice(index * n, index * n + n));
};

export const SpellCards: React.FC<{ spells: SpellData[] }> = ({ spells }) => {
    const splitSpells = useMemo(() => splitPerPage(spells), [ spells ]);
    return <>
        { splitSpells.map((spells, index) => {
            return <>
                <A4Sheet className="!bg-none" key={ `sheet-spells-${ index }` }>
                    <div className={ styles.cards }>
                        { spells.map((spell) => (
                            <SpellCard key={ spell.originalName } data={ spell }/>
                        )) }
                    </div>
                </A4Sheet>
                {/*<A4Sheet className="!bg-none" key={ `sheet-spells-${ index }` }>*/}
                {/*    <div className={ styles.cards }>*/}
                {/*        { spells.map(() => (*/}
                {/*            <BackCover/>*/}
                {/*        )) }*/}
                {/*    </div>*/}
                {/*</A4Sheet>*/}
            </>;
        }) }</>;
};