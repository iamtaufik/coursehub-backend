const multer = require('multer');
const path = require('path');

function generateFilter(props) {
    let { allowedMimeTypes } = props;
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file || !file.buffer) {
                return callback(null, true);
            }

            if (!allowedMimeTypes.includes(file.mimetype)) {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                return callback(err, false);
            }
            callback(null, true);
        },
        onError: (err, next) => {
            next(err);
        }
    });
}

module.exports = {
    upload: generateFilter({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
    }),
};