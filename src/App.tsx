import { SheetGenerator } from '@components/markup/SheetGenerator';

export const App = () => {
    return (
        <div
            className={
                'w-full flex items-center flex-col pb-[30px] small:items-start small:pr-[2mm] small:pl-[2mm] gap-[5mm]'
            }
        >
            <SheetGenerator />
            <footer className='text-white flex gap-[5mm] items-center justify-center'>
                <span>Version 1.2</span>
                <span>Author: Ivan Sapeha</span>
                <a
                    className='border rounded-[2mm] font-Advent border-white pr-[2mm] pl-[2mm] bg-[#004d11]'
                    href={
                        'https://www.paypal.com/donate/?hosted_button_id=PVN9XFL6RJCYS'
                    }
                >
                    Support Me
                </a>
            </footer>
        </div>
    );
};