const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { ShareServiceClient, StorageSharedKeyCredential } = require('@azure/storage-file-share');

const app = express();

const AZURE_ACCOUNT_NAME = 'backupsgmb';
const AZURE_ACCOUNT_KEY = 'saPY11CirPjaIzURE2Wxwhvr6a1xCaKxadEXbLyD3xsGB1ziMsP5lhE+S6ZRbsdYfPOgP1hYeYUUY65a8GUWXw==';
const SHARE_NAME = 'hdm/videos';

const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCOUNT_KEY);
const serviceClient = new ShareServiceClient(
  `https://${AZURE_ACCOUNT_NAME}.file.core.windows.net`,
  sharedKeyCredential
);

const upload = multer({ storage: multer.memoryStorage() });
const bufferSize = 4 * 1024 * 1024;  // 8 MiB
const MAX_RETRIES = 3;
const clients = {};

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.post('/upload', upload.single('video'), async (req, res) => {

    const clientId = req.header('X-Client-ID');

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const shareClient = serviceClient.getShareClient(SHARE_NAME);
    const directoryClient = shareClient.getDirectoryClient('');
    const fileClient = directoryClient.getFileClient(req.file.originalname);

    try {
        // Crear el archivo con el tamaño total
        await fileClient.create(req.file.size);

        let offset = 0;
        const fileLength = req.file.size;

        while (offset < fileLength) {
            const segmentLength = Math.min(bufferSize, fileLength - offset);
            const segment = req.file.buffer.slice(offset, offset + segmentLength);
            
            // Diagnóstico
          /*   console.log("Uploading segment:", {
                offset: offset,
                segmentLength: segmentLength,
                remainingFileLength: fileLength - offset
            }); */
            
            // Intenta subir el fragmento
            await uploadSegment(fileClient, segment, offset, segmentLength);
            offset += segmentLength;
            
            const progress = Math.round((offset / fileLength) * 100);
            emitProgress(clientId, progress);
        }

        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send('Failed to upload file.');
    }
});

async function uploadSegment(fileClient, segment, offset, segmentLength) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            await fileClient.uploadRange(segment, offset, segmentLength);
            return;
        } catch (error) {
            retries++;
            console.error(`Error uploading segment. Retry ${retries}/${MAX_RETRIES}`);
            if (retries === MAX_RETRIES) {
                throw error;
            }
        }
    }
}

app.get('/videos', async (req, res) => {
    try {
        const shareClient = serviceClient.getShareClient(SHARE_NAME);
        const directoryClient = shareClient.getDirectoryClient('');
        const files = [];
        for await (const file of directoryClient.listFilesAndDirectories()) {
            if (file.kind === "file") {
                files.push(file.name);
            }
        }
        res.json(files);
    } catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).send('Failed to fetch videos.');
    }
});

app.get('/video/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const shareClient = serviceClient.getShareClient(SHARE_NAME);
        const directoryClient = shareClient.getDirectoryClient('');
        const fileClient = directoryClient.getFileClient(filename);

        const downloadResponse = await fileClient.download(0);
        const readStream = downloadResponse.readableStreamBody;

        if (readStream) {
            readStream.pipe(res);
        } else {
            res.status(404).send('File not found.');
        }
    } catch (error) {
        console.error('Error fetching video:', error.message);
        res.status(500).send('Failed to fetch video.');
    }
});

app.get('/progress/:clientId', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = req.params.clientId;
    clients[clientId] = res;

    req.on('close', () => {
        delete clients[clientId];
    });
});

function emitProgress(clientId, progress) {
    if (clients[clientId]) {
        clients[clientId].write(`data: ${progress}\n\n`);
    }
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});