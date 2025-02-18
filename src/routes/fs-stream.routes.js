const express = require('express');
const router = express.Router();
const fsStreamController = require('../controllers/fs-stream.controller');

router.get('/:filename', fsStreamController.streamVideo);

module.exports = router;
