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
        const lastId = passives[passives.length - 1]?.id ?? 0;
        setPassives(
            passives
                .concat({ ...data, id: lastId + 1 })
                .toSorted((a, b) => a.id - b.id),
        );
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

    return { passives, addPassive, removePassive, getPassive };
};
