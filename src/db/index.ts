import { IndexedDBProps } from 'react-indexed-db-hook/src/indexed-hooks.ts';

export const DBConfig: IndexedDBProps = {
    name: 'ImagesDB',
    version: 2,
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
        {
            store: 'spells',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'lang', keypath: 'lang', options: { unique: false } },
                { name: 'data', keypath: 'data', options: { unique: false } },
            ],
        },
        {
            store: 'items',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'lang', keypath: 'lang', options: { unique: false } },
                { name: 'data', keypath: 'data', options: { unique: false } },
            ],
        },
    ],
};

export interface ImageDBData {
    name: string;
    image: File | string;
    id: number;
}
