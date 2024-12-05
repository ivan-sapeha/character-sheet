import { SheetGenerator } from '@components/markup/SheetGenerator';

export const App = () => {
    // return <SpellCards spells={spells} />;
    return (
        <div
            className={
                'w-full flex items-center flex-col pb-[30px] small:items-start small:pr-[2mm] small:pl-[2mm]'
            }
        >
            <SheetGenerator />
        </div>
    );
};
