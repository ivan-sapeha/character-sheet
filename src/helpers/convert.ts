export const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const svgToCssUrl = (svg: string) => {
    const base64Svg = btoa(svg);
    return `data:image/svg+xml;base64,${base64Svg}`;
};
