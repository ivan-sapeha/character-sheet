// import L from 'leaflet';
//
// const divIconCache = new Map<string, L.DivIcon>();
// const arcCache = new Map<string, string>();
const polarToCartesian = (
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    angleInDegrees: number,
) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + radiusX * Math.cos(angleInRadians),
        y: centerY + radiusY * Math.sin(angleInRadians),
    };
};

export const describeArc = (
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    startAngle: number,
    endAngle: number,
) => {
    const end = polarToCartesian(x, y, radiusX, radiusY, endAngle);
    const start = polarToCartesian(x, y, radiusX, radiusY, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
        'M',
        start.x,
        start.y,
        'A',
        radiusX,
        radiusY,
        0,
        largeArcFlag,
        1, // Sweep flag set to 1 for clockwise
        end.x,
        end.y,
    ].join(' ');

    return d;
};

// const width = 32,
//     height = 32;

// const createArcString = (colors: string[]) => {
//     const strokeWidth = 8;
//     let svg = `<path fill="none" stroke="#fff" stroke-width="${strokeWidth}" d="${describeArc(
//         width / 2,
//         height / 2,
//         width / 2 - strokeWidth / 2,
//         0,
//         359.999,
//     )}" />`;
//     const sectorAngle = 360 / colors.length;
//     colors.forEach((color, index) => {
//         const strokeWidth = 6;
//         svg += `<path fill="none" stroke="currentColor" stroke-width="${strokeWidth}" class="text-pin-${color}" d="${describeArc(
//             width / 2,
//             height / 2,
//             width / 2 - 1 - strokeWidth / 2,
//             colors.length > 1 ? index * sectorAngle + 5 : 0,
//             colors.length > 1 ? (index + 1) * sectorAngle : 359.999,
//         )}"/>`;
//     });
//     arcCache.set(colors.join(''), svg);
//     return svg;
// };
//
// const addTextToArcString = (arc: string, text: string) => {
//     const textSize = text.length == 1 ? 16 : text.length <= 2 ? 14 : 10;
//     const textOffset = text.length == 1 ? 5.5 : text.length <= 2 ? 5 : 3.5;
//     return (
//         `<circle cx="${width / 2}" cy="${height / 2}" r="${
//             width / 2 - 1
//         }" fill="white"/>` +
//         arc +
//         `<text x="${width / 2}" y="${
//             height / 2
//         }" fill="black" text-anchor="middle" dy="${textOffset}px" font-size="${textSize}px" font-weight="bold">${text}</text>`
//     );
// };
//
// export const createArcMarkerString = (
//     colors: string[],
//     text?: string,
// ): L.DivIcon => {
//     colors = [...new Set(colors)];
//     colors.sort();
//     const arcKey = colors.join('');
//     const divKey = arcKey + (text ? text : '');
//     let divIcon = divIconCache.get(divKey);
//     if (divIcon) {
//         return divIcon;
//     }
//     let arc: string = arcCache.get(arcKey) ?? createArcString(colors);
//     if (text) {
//         arc = addTextToArcString(arc, text);
//     }
//     arc =
//         '<svg width="32" height="32" viewBox="0 0 32 32" style="filter: drop-shadow(0 4px 16px rgba(0,0,0,0.4))">' +
//         arc +
//         '</svg>';
//     divIcon = L.divIcon({
//         html: arc,
//         className: JSON.stringify(colors),
//         iconSize: [32, 32],
//     });
//     divIconCache.set(divKey, divIcon);
//     return divIcon;
// };
