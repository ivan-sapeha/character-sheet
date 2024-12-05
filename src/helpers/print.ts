import { mmToPx } from './dpi.ts';

const width = mmToPx(210);
const height = mmToPx(297);

export const printContent = (element: HTMLElement, name?: string) => {
    const WinPrint = window.open(
        '',
        '',
        `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`,
    )!;
    WinPrint.document.title = name ?? 'Export';
    const printWhenReady = () => {
        setTimeout(() => {
            WinPrint.print();
        }, 5000);
    };
    WinPrint.document.body.innerHTML = document.head.innerHTML;
    const result = element.cloneNode(true);
    WinPrint.document.body.appendChild(result);
    WinPrint.document.addEventListener('click', () => WinPrint.print());
    WinPrint.document.close();
    WinPrint.focus();
    printWhenReady();
};
