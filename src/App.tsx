import { SheetGenerator } from '@components/markup/SheetGenerator';
import { Dialog } from '@components/ui/Dialog';
import { Suspense, useState, lazy } from 'react';
import { useTranslate } from './contexts/Translator.tsx';
import { version } from '../package.json';
import payPal from './assets/images/icons/PayPal.svg';
import mono from './assets/images/icons/monobank-logo.png';
import { isNowBetweenDates } from './helpers/generic-helpers.tsx';

const canShowSnow = isNowBetweenDates('18.12', '10.01');
const SnowOverlay =
    canShowSnow &&
    lazy(() =>
        import('react-snow-overlay').then((res) => ({
            default: res.SnowOverlay,
        })),
    );

export const App = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { tokens } = useTranslate();

    return (
        <div
            className={
                'w-full flex items-center flex-col pb-[30px] small:items-start gap-[5mm]'
            }
        >
            {canShowSnow && SnowOverlay && (
                <Suspense>
                    <SnowOverlay />
                </Suspense>
            )}

            <SheetGenerator />
            <footer className='text-white flex gap-[5mm] items-center justify-center w-full'>
                <span>Version {version}</span>
                <span>Author: Ivan Sapeha</span>
                <button
                    className='border rounded-[2mm] font-Advent border-white pr-[2mm] pl-[2mm]  shadow-highlight'
                    onClick={() => setDialogOpen(true)}
                >
                    {tokens.UI.supportMe}
                </button>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <div
                        className={
                            'flex flex-col justify-center items-center gap-[5mm]'
                        }
                    >
                        <a
                            href={
                                'https://www.paypal.com/donate/?hosted_button_id=PVN9XFL6RJCYS'
                            }
                            className={'p-[5mm] bg-[#ffffff77] rounded-[4mm]'}
                        >
                            <img
                                src={payPal}
                                alt={'PayPal'}
                                className={'max-h-[100px]'}
                            />
                        </a>
                        <a
                            href={'https://send.monobank.ua/jar/4obHoD4h7U'}
                            className={
                                'p-[5mm] bg-[#ffffff77] rounded-[4mm] w-full flex justify-center'
                            }
                        >
                            <img
                                src={mono}
                                alt={'mono'}
                                className={'max-h-[100px]'}
                            />
                        </a>
                    </div>
                </Dialog>
            </footer>
        </div>
    );
};
