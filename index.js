import express from 'express';
import fileUpload from 'express-fileupload';
import './config.js'
import { uploadFile, getFiles, getFile, downloadFile, getFileUrl } from './s3.js';

const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './'
}));

app.get('/files', async (req, res) => {
    const result = await getFiles();
    res.json(result.Contents);
}
);

app.get('/files/:fileName', async (req, res) => {
    const result = await getFileUrl(req.params.fileName);
    res.send({
        url: result
    });
});

app.get('/download/:fileName', async (req, res) => {
    await downloadFile(req.params.fileName);
    res.send({message: 'File downloaded'});
}
);

app.post('/files', async (req, res) => {
    const result = await uploadFile(req.files.file);
    res.json({ result });
});

// making our image folder public
app.use(express.static('images'));

app.listen(3000)
console.log('Listening on port 3000');