import { useLocalStorage } from 'usehooks-ts';

export interface PassiveData {
    id: number;
    name: string;
    icon: number;
    description?: string;
}

export const usePassives = () => {
    const [passives, setPassives] = useLocalStorage<PassiveData[]>(
        'passives',
        [],
    );

    const addPassive = (data: Omit<PassiveData, 'id'>) => {
        let index = 1;

        setPassives((passives) => {
            const lastId = passives[passives.length - 1]?.id ?? 0;
            index = lastId + 1;
            return passives
                .concat({ ...data, id: lastId + 1 })
                .toSorted((a, b) => a.id - b.id);
        });
        return index;
    };

    const updatePassive = (passive: PassiveData) => {
        const index = passives.findIndex(
            (currentPassive) => passive.id === currentPassive.id,
        );
        if (index < 0) {
            return;
        }
        setPassives(passives.toSpliced(index, 1, passive));
    };

    const removePassive = (id: number) => {
        const index = passives.findIndex((passive) => passive.id === id);
        if (index < 0) {
            return;
        }
        setPassives(passives.toSpliced(index, 1));
    };

    const getPassive = (id: number) => {
        const passive = passives.find((passive) => passive.id === id);
        if (!passive) {
            return;
        }
        return passive;
    };

    const getPassivesInOrder = (ids: number[]): PassiveData[] => {
        return ids.map(getPassive).filter(Boolean) as PassiveData[];
    };

    const getPassiveIdByData = (data: PassiveData): number => {
        return (
            passives.find(
                (passive) =>
                    passive.description === data.description &&
                    passive.icon === data.icon &&
                    passive.name === data.name,
            )?.id ?? -1
        );
    };

    return {
        passives,
        addPassive,
        removePassive,
        getPassive,
        updatePassive,
        getPassivesInOrder,
        getPassiveIdByData,
    };
};
