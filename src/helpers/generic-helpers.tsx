import { ReactElement } from 'react';

export const clone = <T extends object>(obj: T) =>
    JSON.parse(JSON.stringify(obj)) as T;

export const keys = <T extends object>(obj: T) =>
    Object.keys(obj) as Array<keyof T>;
export const entries = <T extends object>(obj: T) =>
    Object.entries(obj) as Array<[keyof T, T[keyof T]]>;

export const convert1Dto2D = <T extends object>(
    array: T[],
    columns: number,
): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += columns) {
        result.push(array.slice(i, i + columns));
    }
    return result;
};

export const splitCamelCase = (text: string): string => {
    const words = text.split(/\s{0}(?=[A-Z])/);
    const lastWord = words.pop()!;
    const numberIndex = [...lastWord].findIndex(
        (char) => !Number.isNaN(Number(char)),
    );
    if (numberIndex < 0) {
        return words.concat(lastWord).join(' ');
    } else {
        const first = lastWord.substring(0, numberIndex);
        const second = lastWord.substring(numberIndex);
        return words.concat([first, second]).join(' ');
    }
};

export const highlightSubString = (
    text: string,
    substring: string,
    color: string,
): ReactElement => {
    const editedText = text.replaceAll(' ', '').toLowerCase();
    const editedSubstring = substring.replaceAll(' ', '').toLowerCase();
    if (!editedText.includes(editedSubstring)) {
        return <>{text}</>;
    }

    let startIndex = editedText.indexOf(editedSubstring);

    let start = text.substring(0, startIndex);
    startIndex += start.length - start.replaceAll(' ', '').length;
    start = text.substring(0, startIndex);
    let highlighted = text.substring(startIndex, startIndex + substring.length);
    const highlightedLastIndex =
        startIndex +
        substring.length +
        highlighted.length -
        highlighted.replaceAll(' ', '').length;
    highlighted = text.substring(startIndex, highlightedLastIndex);
    const end = text.substring(highlightedLastIndex, Infinity);

    return (
        <>
            {start}
            <span
                style={{
                    color,
                    fontWeight: 'bold',
                }}
            >
                {highlighted}
            </span>
            {end}
        </>
    );
};
