const sharp = require("sharp");
const fs = require("fs");
const {PDFImage} = require("pdf-image");

/**
 * A helper method that compresses a jpeg file buffer consecutively until under
 * 100 kb or less that 20% of the original quality. In addition, it resizes the
 * image to be 1000px wide.
 * @param {Buffer} fileBuffer a file buffer containing image data, to compress 
 * @returns {Buffer} a file buffer containing the resultant compressed image data
 * Errors: If the image compressor has an issue, prints the error and throws it.
 */
const compressImage = async (fileBuffer) => {
    try {
        let compressedBuffer = fileBuffer;
        let quality = 95;
        let compressedSize = fileBuffer.length;

        while (compressedSize > 100 * 1024 && quality > 20) {
            compressedBuffer = await sharp(fileBuffer)
                .resize({ width: 1000 })
                .jpeg({ quality })
                .toBuffer();
            compressedSize = compressedBuffer.length;
            quality -= 5;
        }

        return compressedBuffer;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};

/**
 * This async function converts *the first page* of a pdf to an image. To do this it first
 * writes to a temporary shared file path. Not async safe.
 * @param {NodeJS.ArrayBufferView} pdfBuffer the pdf buffer containing the full pdf data
 * @returns {NonSharedBuffer} the resultant image buffer of the first page
 */
const convertPdfToImage = async (pdfBuffer) => {
    try {
        const tempFilePath = './temp.pdf';
        fs.writeFileSync(tempFilePath, pdfBuffer);

        const pdfImage = new PDFImage(tempFilePath, {
            combinedImage: true,
            convertOptions: {
                "-resize": "1000x",
                "-quality": "95"
            }
        });

        const imagePath = await pdfImage.convertPage(0);
        const imageBuffer = fs.readFileSync(imagePath);

        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(imagePath);

        return imageBuffer;
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        throw error;
    }
};

module.exports = { compressImage, convertPdfToImage };