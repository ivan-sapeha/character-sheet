const getPxInMm = () => {
    const temp = document.createElement('div');
    temp.style.width = '100mm';
    temp.style.height = '1mm';
    temp.style.position = 'absolute';
    temp.style.top = '-100%';
    document.body.appendChild(temp);

    // Measure the size of the element in pixels
    const pxInMm = temp.offsetWidth / 100;

    // Remove the temporary element
    document.body.removeChild(temp);

    return pxInMm;
};

export const pxInMm = getPxInMm();

export const mmToPx = (mm: number) => mm * pxInMm;
