const sharp = require("sharp");
const fs = require("fs");
const {PDFImage} = require("pdf-image");
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