const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const fsStreamRouter = require('./routes/fs-stream.routes');
const hlsStreamRouter = require('./routes/hls-stream.routes');

app.use('/api/fs-stream', fsStreamRouter);
app.use('/api/hls-stream', hlsStreamRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.use((req, res) => {
	res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Access the server at http://localhost:${PORT}`);
});
