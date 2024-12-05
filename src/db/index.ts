import { IndexedDBProps } from 'react-indexed-db-hook/src/indexed-hooks.ts';

export const DBConfig: IndexedDBProps = {
    name: 'ImagesDB',
    version: 1,
    objectStoresMeta: [
        {
            store: 'avatar',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'name', keypath: 'name', options: { unique: false } },
                { name: 'image', keypath: 'image', options: { unique: false } },
            ],
        },
        {
            store: 'background',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'name', keypath: 'name', options: { unique: false } },
                { name: 'image', keypath: 'image', options: { unique: false } },
            ],
        },
        {
            store: 'icon',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'name', keypath: 'name', options: { unique: false } },
                { name: 'image', keypath: 'image', options: { unique: false } },
            ],
        },
    ],
};

export interface ImageDBData {
    name: string;
    image: File | string;
    id: number;
}
