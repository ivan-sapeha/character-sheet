import { SheetGenerator } from '@components/markup/SheetGenerator';

export const App = () => {
    return (
        <div
            className={
                'w-full flex items-center flex-col pb-[30px] small:items-start small:pr-[2mm] small:pl-[2mm] gap-[5mm]'
            }
        >
            <SheetGenerator />
            <footer className='text-white flex gap-[5mm]'>
                <span>Version 1.2</span>
                <span>Author: Ivan Sapeha</span>
            </footer>
        </div>
    );
};
