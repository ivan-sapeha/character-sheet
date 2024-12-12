export const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const b64ToFile = (filename: string, base64: string): Promise<File> => {
    return new Promise((resolve, reject) => {
        try {
            const [metadata, base64Data] = base64.split(',');
            const mimeMatch = metadata.match(/:(.*?);/);
            if (!mimeMatch) {
                reject(new Error('Invalid base64 string'));
                return;
            }
            const mime = mimeMatch[1];

            const binaryString = window.atob(base64Data);

            const len = binaryString.length;
            const byteArray = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                byteArray[i] = binaryString.charCodeAt(i);
            }

            // Create a Blob object representing the data as a file
            const blob = new Blob([byteArray], { type: mime });

            const file = new File([blob], filename, { type: mime });
            resolve(file);
        } catch (error) {
            reject(error);
        }
    });
};
export const svgToCssUrl = (svg: string) => {
    const base64Svg = btoa(svg);
    return `data:image/svg+xml;base64,${base64Svg}`;
};

export const downloadFile = (name: string, data: string): void => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
