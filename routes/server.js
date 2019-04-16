const express = require('express');
const router = express.Router();
// https://docs.min.io/cn/javascript-client-quickstart-guide.html
const Minio = require('minio');
const config = require('../config');
const BucketName = config.BucketName;

/* GET home page. */
router.get('/', open);
router.put('/', save);

function open(req, res, next) {
    let fileName = req.param('filename');
    minioClient.getObject(BucketName, fileName, function (err, dataStream) {
        let size;
        let bufferList = [];
        if (err) {
            if (err.code === 'NoSuchKey') {
                res.render('edit', {fileName: fileName, imageData: config.NewFileContent});
                return;
            }
            console.log(err);
            res.send(500, err);
            return;
        }
        dataStream.on('data', function (chunk) {
            size += chunk.length;
            bufferList = bufferList.concat(Array.from(chunk));
        });
        dataStream.on('end', function () {
            // https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
            let fileContent = Buffer.from(bufferList).toString();
            console.log('End. Total size = ' + size + ',content = ' + fileContent);
            res.render('edit', {fileName: fileName, imageData: fileContent});
        });
        dataStream.on('error', function (err) {
            console.log(err);
            res.send(500, err);

        });
    });
}

function save(req, res, next) {
    let filename = req.body.filename;
    let data = req.body.data;
    try {
        minioClient.putObject(BucketName, filename, data, function (err, etag) {
            console.log(err, etag); // err should be null
            if (err) {
                res.send(500, err.toString);
            }
        });
    } catch (e) {
        res.send(500, e.toString());
    }
    res.send('success');
}

let minioClient = new Minio.Client(config.MinioConfig);

module.exports = router;
