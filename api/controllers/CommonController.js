var fs = require('fs');
var Busboy = require('busboy');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var db = new mongo.Db('homework', new mongo.Server("127.0.0.1", 27017), {safe: false});
var gfs;
var utils = require('./utils');

db.open(function (err) {
    if (err) {
        throw err;
    }
    gfs = Grid(db, mongo);
});

module.exports.imageUpload = function (req, res) {
    var busboy = new Busboy({headers: req.headers});
    var fileIds = [];
    var body = {};

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // console.log('got file', filename, mimetype, encoding);
        fileIds.push(new mongo.ObjectId());
        console.log('got file', fieldname, filename);
        var writeStream = gfs.createWriteStream({
            _id: fileIds[fileIds.length - 1],
            filename: filename,
            mode: 'w',
            content_type: mimetype
        });
        file.pipe(writeStream);
    }).on('field', function (key, value) {
        body[key] = value;
    }).on('finish', function () {
        utils.jsonResponse(res, 200, {
            ret: 0,
            msg: '',
            data: {
                imageId: fileIds[0]
            }
        })
    });

    req.pipe(busboy);
};

module.exports.getImage = function (req, res) {
    var _id = new mongo.ObjectId(req.query.imageId);

    gfs.files.findOne({'_id': _id}, function (err, file) {
        // gfs.files.find({}).toArray(function (err, files) {
        //     console.log(util.inspect(file, {showHidden: false, depth: null}));
        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('');

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename=""');

        var readstream = gfs.createReadStream({
            _id: file._id
        });

        readstream.on("error", function(err) {
            console.log("Got error while processing stream " + err.message);
            res.end();
        });

        readstream.pipe(res);
    });
};