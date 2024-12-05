import { FC, useId } from 'react';
import { mmToPx } from '../../../helpers/dpi.ts';
import { describeArc } from '../../../helpers/marker-arc.ts';

export interface CurvedTextProps {
    text: string;
    side: 'left' | 'right';
}

export const CurvedText: FC<CurvedTextProps> = ({ text, side }) => {
    const rx = mmToPx((37 + 2) / 2);
    const ry = mmToPx((40 + 2) / 2);
    // const d = describeArc(rx+20, ry+20, rx, ry, 270, 0-30);
    const d =
        side === 'left'
            ? describeArc(rx + 12, ry + 20, rx - 10, ry + 5, 250, -25)
            : describeArc(rx - 15, ry + 20, rx + 5, ry, 25, 110);
    const id = useId();
    return (
        <svg viewBox={`0 0 ${rx * 2} ${ry * 2}`} width={rx * 2} height={ry * 2}>
            <defs>
                <path id={id} d={d} />
            </defs>
            <text fill={'#50391b'}>
                <textPath
                    startOffset={`${(1 - text.length / 12) * 50}%`}
                    method='stretch'
                    href={`#${id}`}
                >
                    {text}
                </textPath>
            </text>
            {/*<path strokeWidth={2} stroke='white' id={ id } d={ d }/>*/}
        </svg>
    );
};
