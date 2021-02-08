const express = require('express');
const router = express.Router();
// https://docs.min.io/cn/javascript-client-quickstart-guide.html
const Minio = require('minio');
const config = require('../config');
const BucketName = config.BucketName;

/* GET home page. */
router.get('/list', list);
router.get('/', open);
router.put('/', save);

function list(req, res, next) {
    var stream = minioClient.listObjects(BucketName, '', true);
    let fileList = [];
    var ex = '.drawio';
    stream.on('data', function (obj) {
        console.log('list data');
        console.log(obj);

        //endwith ex
        if (obj.name.substring(obj.name.length - ex.length) == ex) {
            fileList.push(obj.name);
        }

    });
    stream.on('end', function () {
        console.log('End. fileList size = ' + fileList.length);
        res.render('list', { count: fileList.length, fileList: fileList });
    });
    stream.on('error', function (err) {
        console.log('list error' + err);
        res.status(500).send(err);
    })
}
function open(req, res, next) {
    let fileName = req.param('filename');
    console.log('fileName ' + fileName);
    minioClient.getObject(BucketName, fileName, function (err, dataStream) {
        console.log('get file');
        let size = 0;
        let bufferList = [];
        if (err) {
            if (err.code === 'NoSuchKey') {
                res.render('edit', { fileName: fileName, imageData: config.NewFileContent });
                return;
            }
            console.log('err ' + err);
            // res.send(500, err);
            res.status(500).send(err);
            return;
        }
        dataStream.on('data', function (chunk) {
            console.log('on data size' + chunk.length);
            size += chunk.length;
            bufferList = bufferList.concat(Array.from(chunk));
        });
        dataStream.on('end', function () {
            console.log('on end size' + size);

            // https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
            let fileContent = Buffer.from(bufferList).toString();
            console.log('End. Total size = ' + size + ',content = ' + fileContent);
            res.render('edit', { fileName: fileName, imageData: fileContent });
        });
        dataStream.on('error', function (err) {
            console.log('on error ' + err);

            console.log(err);
            res.status(500).send(err);
            // res.send(500, err);

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
                res.status(500).send(err.toString);
                // res.send(500, err.toString);
            }
        });
    } catch (e) {
        res.status(500).send(err.toString);
        // res.send(500, e.toString());
    }
    res.send('success');
    // res.send('success');
}

let minioClient = new Minio.Client(config.MinioConfig);

module.exports = router;
