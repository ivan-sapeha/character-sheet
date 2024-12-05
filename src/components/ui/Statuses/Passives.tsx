import { PassivesEditorDialog } from '@components/markup/Editor/PassivesEditor.tsx';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { ImageDBData } from '../../../db';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { PassiveData, usePassives } from '../../../hooks/usePassives.ts';
import styles from './Statuses.module.less';
import reroll from '@assets/images/icons/reroll.png';
import fear from '@assets/images/icons/fear.png';
import poison from '@assets/images/icons/poison.png';
import fey from '@assets/images/icons/fey.png';
import cool from '@assets/images/icons/cool.png';
import singlecell from '@assets/images/singlecell.png';
import ritual from '@assets/images/icons/ritual.png';
import shadow from '@assets/images/icons/shadow.png';
import manarest from '@assets/images/icons/mana_restore.png';
import explore from '@assets/images/icons/explore.png';
import summon from '@assets/images/icons/summon.png';
import necromancySavant from '@assets/images/icons/necromancySavant.png';
import grimHarvest from '@assets/images/icons/grimHarvest.png';
import darkvision from '@assets/images/icons/darkvision.png';
import hellishResistance from '@assets/images/icons/hellishResistance.png';
import infernalLegacy from '@assets/images/icons/infernalLegacy.png';
import criminalConnections from '@assets/images/icons/criminalConnections.png';

const monti = [
    {
        name: 'Стійкість до отрут',
        img: poison,
        description:
            'Перевага на кидки рятунку від отрути та спротив пошкодженням отрутою.',
    },
    {
        name: 'Стійкість до залякувань',
        img: fear,
        description: 'Перевага на кидки рятунку від страху.',
    },
    {
        name: 'Везучий',
        img: reroll,
        description: 'Коли на к20 випадає 1 можеш перекинути кістку.',
    },
    {
        name: 'Спритність напівросликів',
        img: singlecell,
        description: 'Можеш проходити крізь простір більших істот.',
    },
    {
        name: 'Малий виклик',
        img: summon,
        description:
            'Починаючи з 2 рівня, коли ви обираєте цю школу, ви можете дією створити неживий предмет у своїй руці або на землі у вільному просторі, який ви можете бачити, і який знаходиться в межах 10 футів від вас. Цей предмет не повинен перевищувати в довжину 1 фут (30 сантиметрів) і важити більше 10 фунтів, і його форма повинна бути як у немагічного предмета, який ви вже бачили. Видно, що предмет магічний, і він випромінює тьмяне світло в межах 5 футів. Предмет зникає через 1 годину, коли ви використовуєте цю здатність знову, або коли він отримує будь-яке пошкодження.',
    },
    {
        name: 'Зачарований феями',
        img: fey,
        description:
            'Збільшує ваш показник Інтелекту, Мудрості або Харизми на 1, до максимуму 20. Ви вивчаєте заклинання туманний крок і одне заклинання 1-го рівня на ваш вибір. Заклинання 1-го рівня має бути зі школи ворожіння або зачарування. Ви можете накладати кожне з цих заклинань без витрати чарунки заклинань.',
    },
    {
        name: 'Ритуальна магія',
        img: ritual,
        description:
            'Ви можете виконати заклинання чарівника як ритуал, якщо у цього заклинання є ключове слово «ритуал», і воно є у вашій книзі заклинань. Вам не потрібно мати це заклинання підготовленим.',
    },
    // {
    //     name: 'Магічне відновлення',
    //     img: manarest,
    //     description:
    //         'Можливість один раз на день після короткого відпочинку відновити одну комірку магії.',
    // },
    {
        name: 'Дослідник',
        img: explore,
        description:
            'Якщо ти намагаєшся дослідити чи згадати інформацію, якою не володієш, то часто знаєш, як її можна дістати. Зазвичай це бібліотека, скрипторій, університет, або інша освідчена община.',
    },
    {
        name: 'Крутий',
        img: cool,
        description: 'Ви просто крутий.',
    },
];

const lyra = [
    //     {
    //         name: 'Магічне відновлення',
    //         img: manarest,
    //         description:
    //             'Ви можете відновити деяку кількість магічної енергії під час короткого відпочинку. Коли ви закінчуєте короткий відпочинок, ви можете обрати витрачені чарівні слоти для відновлення. Слоти можуть мати загальний рівень, що дорівнює або менше половини вашого рівня мага (округлено вгору).',
    //     },
    {
        name: 'Ритуальна магія',
        img: ritual,
        description:
            'Ви можете виконати заклинання чарівника як ритуал, якщо у цього заклинання є ключове слово «ритуал», і воно є у вашій книзі заклинань. Вам не потрібно мати це заклинання підготовленим.',
    },
    {
        name: 'Майстер некромантії',
        img: necromancySavant,
        description:
            'Починаючи з 2-го рівня, час і золото, необхідні для копіювання заклинань некромантії у вашу книгу заклинань, скорочуються вдвічі.',
    },
    {
        name: 'Похмурий врожай',
        img: grimHarvest,
        description:
            "Починаючи з 2-го рівня, ви отримуєте користь від життєвої сили тих, кого вбиваєте своїми заклинаннями. Коли ви вбиваєте одну або більше істот заклинанням 1-го рівня або вище, ви отримуєте очки здоров'я, рівні двічі рівню заклинання або тричі, якщо заклинання належить до школи некромантії.",
    },
    {
        name: 'Темний зір (60 футів)',
        img: darkvision,
        description:
            'Завдяки вашій темній спадщині, ви маєте темний зір на відстань до 60 футів. Ви можете бачити в умовах слабкого освітлення так, ніби це яскраве світло, і в умовах повної темряви так, ніби це слабке освітлення. Ви не можете розрізняти кольори в темряві, тільки відтінки сірого.',
    },
    {
        name: 'Пекельна спадщина',
        img: infernalLegacy,
        description:
            'Ви знаєте заклинання тауматургії і можете використовувати його за бажанням. Починаючи з 3-го рівня, ви можете раз на день використовувати заклинання "Пекельний виклик" як заклинання 2-го рівня. Починаючи з 5-го рівня, ви можете раз на день використовувати заклинання "Темрява".',
    },
    {
        name: 'Пекельна стійкість',
        img: hellishResistance,
        description:
            'Ви маєте стійкість до вогню, що означає, що ви отримуєте половину шкоди від джерел вогню.',
    },
    {
        name: "Кримінальні зв'язки",
        img: criminalConnections,
        description:
            'Ви маєте контакт з кримінальним підпіллям, яке надає вам інформацію та ресурси. Ви можете знайти місце для приховування, повідомити про злочинну діяльність або отримати допомогу від злочинців у будь-якому місті.',
    },
    {
        name: 'Дотик з тіні',
        img: shadow,
        description:
            'Ви маєте контакт з кримінальним підпіллям, яке надає вам інформацію та ресурси. Ви можете знайти місце для приховування, повідомити про злочинну діяльність або отримати допомогу від злочинців у будь-якому місті.',
    },
];
export const passives = monti;
export const Passives = () => {
    const { tokens } = useTranslate();
    const { isEdit, currentCharacter } = useCharacter();
    const { getPassive } = usePassives();
    const [dialogOpened, setDialogOpened] = useState(false);

    return (
        <>
            <div
                className={cx(styles.container, styles.passives, {
                    [styles.canActivate]: isEdit,
                })}
                onClick={() => {
                    if (isEdit) {
                        setDialogOpened(true);
                    }
                }}
            >
                <h1 className={styles.header}>{tokens.UI.passives}</h1>
                <div className={styles.statuses}>
                    {(currentCharacter.passives ?? [])
                        .map(getPassive)
                        .filter(Boolean)
                        .map((passive) => (
                            <Passive key={passive!.id} passive={passive!} />
                        ))}
                </div>
            </div>
            {isEdit && (
                <PassivesEditorDialog
                    open={dialogOpened}
                    onClose={() => {
                        setDialogOpened(false);
                    }}
                />
            )}
        </>
    );
};

export const Passive: React.FC<{
    passive: PassiveData;
    onClick?: () => void;
    className?: string;
}> = ({ passive, onClick, className }) => {
    const { getByID } = useIndexedDB('icon');
    const [iconSrc, setIconSrc] = useState('');
    useEffect(() => {
        if (passive.icon === -1) {
            return;
        }
        getByID<ImageDBData>(passive.icon).then((icon) =>
            setIconSrc(icon.image as string),
        );
    }, [passive]);
    return (
        <div
            className={cx(styles.status, styles.passive, className)}
            onClick={onClick}
        >
            {passive.icon !== -1 && <img src={iconSrc} />}
            {passive.name}
        </div>
    );
};
