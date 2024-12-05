import React, { Fragment } from 'react';
import { nanoid } from 'nanoid';
export const reactJoin = (
    array: React.ReactElement[] | string[],
    separator: string | React.ReactElement,
) => {
    return array.map((element, index) => {
        return (
            <Fragment key={`joined-element-${nanoid()}`}>
                {element}
                {index !== array.length - 1 && separator}
            </Fragment>
        );
    });
};
