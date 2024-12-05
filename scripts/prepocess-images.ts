import sharp, { Sharp } from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesPath = path.resolve(__dirname, '../', 'src', 'assets', 'images');
const backgroundsPath = path.resolve(__dirname, '../', 'public', 'backgrounds');
const sourcesFolder = path.resolve(imagesPath, 'sources');
const backgroundsSourcesFolder = path.resolve(backgroundsPath, 'sources');
const outputFolder = path.resolve(imagesPath, 'preprocessed');
const backgroundsOutputFolder = path.resolve(backgroundsPath, 'preprocessed');

const preprocessFiles = async () => {
    const start = performance.now();
    console.log('Preprocessing images');
    const filesToPreprocess = fs.readdirSync(sourcesFolder);
    const backgroundsToPreprocess = fs.readdirSync(backgroundsSourcesFolder);
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }
    if (!fs.existsSync(backgroundsOutputFolder)) {
        fs.mkdirSync(backgroundsOutputFolder);
    }
    console.log('Images that will be preprocessed:');
    console.table(
        filesToPreprocess
            .map((file) => ({
                'File name': path.resolve(sourcesFolder, file),
                'File size': humanReadableFileSize(
                    fs.statSync(path.resolve(sourcesFolder, file)).size,
                ),
            }))
            .concat(
                backgroundsToPreprocess.map((file) => ({
                    'File name': path.resolve(backgroundsSourcesFolder, file),
                    'File size': humanReadableFileSize(
                        fs.statSync(
                            path.resolve(backgroundsSourcesFolder, file),
                        ).size,
                    ),
                })),
            ),
    );
    const outputs = [];
    for (const file of filesToPreprocess) {
        const fileOutputResults = await processImage(file);
        outputs.push(fileOutputResults);
    }
    for (const file of backgroundsToPreprocess) {
        const fileOutputResults = await processBackground(file);
        outputs.push(fileOutputResults);
    }

    Promise.all(outputs.flatMap((value) => value)).then((data) => {
        console.log('Images are processed\nOutputs are:');
        console.table(data.filter(Boolean));
        console.log(
            `Preprocessing time: ${((performance.now() - start) / 1000).toFixed(
                2,
            )}s`,
        );
    });
};

const processImage = async (file: string) => {
    const filePath = path.resolve(sourcesFolder, file);
    const fileName = file.split('.')[0];
    const image = sharp(filePath);
    const hasTransparency = await hasTransparentPixels(image);
    const outputPath = {
        hd: path.resolve(outputFolder, `${fileName}-hd.jpg`),
        transparent: path.resolve(
            outputFolder,
            `${fileName}-hd-transparent.png`,
        ),
        preview: path.resolve(outputFolder, `${fileName}-preview.jpg`),
        previewTransparent: path.resolve(
            outputFolder,
            `${fileName}-preview-transparent.png`,
        ),
    };
    const hdImage = createHDImage(filePath);
    const hdImageOutput = hdImage
        .then((image) =>
            image
                .jpeg({
                    quality: 100,
                    mozjpeg: true,
                    optimizeCoding: true,
                })
                .toFile(outputPath.hd),
        )
        .then((output) => ({
            'File name': outputPath.hd,
            'File size': humanReadableFileSize(output.size),
        }));
    const transparentImage =
        hasTransparency &&
        hdImage
            .then((image) =>
                image.png({ quality: 100 }).toFile(outputPath.transparent),
            )
            .then((output) => ({
                'File name': outputPath.transparent,
                'File size': humanReadableFileSize(output.size),
            }));

    const previewImage = createPreviewImage(filePath)
        .then((image) => make10KbImage(image))
        .then((image) =>
            hasTransparency
                ? image.toFile(outputPath.previewTransparent)
                : image.toFile(outputPath.preview),
        )
        .then((output) => ({
            'File name': hasTransparency
                ? outputPath.previewTransparent
                : outputPath.preview,
            'File size': humanReadableFileSize(output.size),
        }));

    return [hdImageOutput, previewImage, transparentImage];
};

const processBackground = (file: string) => {
    const filePath = path.resolve(backgroundsSourcesFolder, file);
    const fileName = file.split('.')[0];
    const hdImage = createHDImage(filePath);
    const outputPath = path.resolve(backgroundsOutputFolder, `${fileName}.jpg`);
    return [
        hdImage
            .then((image) =>
                image
                    .jpeg({
                        quality: 90,
                        mozjpeg: true,
                        optimizeCoding: true,
                    })
                    .toFile(outputPath),
            )
            .then((output) => ({
                'File name': outputPath,
                'File size': humanReadableFileSize(output.size),
            })),
    ];
};
const createHDImage = async (path: string) => {
    let image = sharp(path);
    const top3PercentResolution = 2160;

    const { width } = await image.metadata();
    if (width! > top3PercentResolution) {
        image = image.resize(top3PercentResolution);
    }
    return image;
};

const createPreviewImage = async (path: string) => {
    let image = sharp(path);
    const previewResolution = 480;
    const { width } = await image.metadata();
    if (width! > previewResolution) {
        image = image.resize(previewResolution);
    }
    return image.blur(5);
};
const range = (start: number, stop: number, step = 1) =>
    Array.from(
        { length: (stop - start) / step + 1 },
        (_value, index) => start + index * step,
    );

const make10KbImage = async (image: Sharp) => {
    const hasTransparency = await hasTransparentPixels(image);
    const targetImageSizeRange = { min: 9.2e3, max: 10.8e3 };
    const qualities = range(5, 100);
    let iterations = 0;

    let low = 0;
    let high = qualities.length - 1;
    let mid = -1;
    let output: Sharp = image;

    // binary search for most optimal preview file size(trying to balance between size and quality)
    while (low <= high && iterations < 15) {
        iterations++;
        mid = Math.floor((low + high) / 2);
        output = hasTransparency
            ? image.png({ quality: qualities[mid] })
            : image.jpeg({
                  quality: qualities[mid],
                  mozjpeg: true,
              });

        const { length: size } = await output.toBuffer();
        if (
            size! > targetImageSizeRange.min &&
            size! <= targetImageSizeRange.max
        ) {
            return output;
        } else if (size! > targetImageSizeRange.max) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return hasTransparency
        ? image.png({ quality: qualities[mid] })
        : image.jpeg({
              quality: qualities[mid],
              mozjpeg: true,
          });
};

const humanReadableFileSize = (size: number) => {
    const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
        Number((size / Math.pow(1024, i)).toFixed(2)) +
        ' ' +
        ['B', 'kB', 'MB'][i]
    );
};

async function hasTransparentPixels(image: Sharp): Promise<boolean> {
    const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Check if the image has an alpha channel
    if (info.channels < 4) {
        return false; // No alpha channel, hence no transparency
    }

    // Iterate through the alpha channel to check for transparency
    for (let i = 3; i < data.length; i += info.channels) {
        if (data[i] < 255) {
            return true; // Found a transparent pixel
        }
    }

    return false; // No transparent pixels found
}

preprocessFiles();
