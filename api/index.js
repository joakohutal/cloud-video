const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { ShareServiceClient, StorageSharedKeyCredential } = require('@azure/storage-file-share');
require('dotenv').config();

const app = express();



const azure_name = process.env.AZURE_ACCOUNT_NAME;
const azure_key = process.env.AZURE_ACCOUNT_KEY;
const share_name = process.env.SHARE_NAME;
const origin_cors = process.env.CORS_ORIGIN;
const port = process.env.SERVER_PORT;

const sharedKeyCredential = new StorageSharedKeyCredential(azure_name, azure_key);
const serviceClient = new ShareServiceClient(
  `https://${azure_name}.file.core.windows.net`,
  sharedKeyCredential
);

const upload = multer({ storage: multer.memoryStorage() });
const bufferSize = 4 * 1024 * 1024;  // 8 MiB
const MAX_RETRIES = 3;
const clients = {};

app.use(cors({
    origin: origin_cors
}));

app.post('/upload', upload.single('video'), async (req, res) => {

    const clientId = req.header('X-Client-ID');

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const shareClient = serviceClient.getShareClient(share_name);
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
        const shareClient = serviceClient.getShareClient(share_name);
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
        const shareClient = serviceClient.getShareClient(share_name);
        const directoryClient = shareClient.getDirectoryClient('');
        const fileClient = directoryClient.getFileClient(filename);

        const fileProperties = await fileClient.getProperties();
        const fileSize = parseInt(fileProperties.contentLength, 10);

        const range = req.headers.range;
        if (!range) {
            const downloadResponse = await fileClient.download(0);
            const readStream = downloadResponse.readableStreamBody;
            
            if (readStream) {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                });
                readStream.pipe(res);
            } else {
                res.status(404).send('File not found.');
            }
        } else {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] 
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const downloadResponse = await fileClient.download(start, chunksize);
            const readStream = downloadResponse.readableStreamBody;

            if (readStream) {
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                });
                readStream.pipe(res);
            } else {
                res.status(404).send('File not found.');
            }
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

app.delete('/video/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const shareClient = serviceClient.getShareClient(share_name);
        const directoryClient = shareClient.getDirectoryClient('');
        const fileClient = directoryClient.getFileClient(filename);

        await fileClient.delete();
        
        res.status(200).send('File deleted successfully.');
    } catch (error) {
        console.error('Error deleting video:', error.message);
        res.status(500).send('Failed to delete video.');
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});