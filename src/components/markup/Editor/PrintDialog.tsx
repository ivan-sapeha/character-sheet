import { Dialog, DialogProps } from '@components/ui/Dialog';
import React, { useId, useState } from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { skipEventLoopTimes } from '../../../helpers/generic-helpers.tsx';
import { printContent } from '../../../helpers/print.ts';
import { generateUUID } from '../../../helpers/uuid.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import guide from '../../../assets/images/how-to-save.jpg';
export const printStorageKey = 'dont-show-print';
export const PrintDialog: React.FC<DialogProps> = ({ open, onClose }) => {
    const { currentCharacter } = useCharacter();
    const { tokens } = useTranslate();
    const checkboxId = useId();
    const [checked, setChecked] = useState(false);
    const onPrint = async () => {
        if (checked) {
            localStorage.setItem(printStorageKey, 'true');
        }
        onClose();
        await skipEventLoopTimes(100);

        printContent(
            document.getElementsByClassName('print')[0] as HTMLDivElement,
            `${currentCharacter.name}_${currentCharacter.surname}`,
        );
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div className='font-Advent flex flex-col gap-[2mm] bg-[#ffffff77] rounded-[2mm] p-[2mm]'>
                <h1 className='text-center pb-[3mm]'>
                    {tokens.UI.guide.howToSave.title}
                </h1>
                {tokens.UI.guide.howToSave.content.map((text) => (
                    <p key={generateUUID()}>{text}</p>
                ))}
                <div className='flex justify-center pt-[4mm]'>
                    <img src={guide} className={'w-[500px] rounded-[2mm]'} />
                </div>
                <div
                    className={'flex flex-col items-center pt-[5mm] gap-[4mm]'}
                >
                    <div className={'flex gap-[2mm]'}>
                        <input
                            type={'checkbox'}
                            id={checkboxId}
                            className={'cursor-pointer'}
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        <label
                            htmlFor={checkboxId}
                            className={'cursor-pointer'}
                        >
                            {tokens.UI.guide.howToSave.checkbox}
                        </label>
                    </div>
                    <button
                        className='border rounded-[2mm] font-Advent border-black pt-[2mm] pb-[2mm] pr-[6mm] pl-[6mm] bg-[#ffffff77] shadow-highlight'
                        onClick={onPrint}
                    >
                        {tokens.UI.print}
                    </button>
                </div>
            </div>
        </Dialog>
    );
};
