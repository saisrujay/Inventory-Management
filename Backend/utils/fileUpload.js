const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,callback) =>{
        callback(null, 'uploads'); 
    },
    filename: (req,file,callback) =>{
        callback(null,new Date().toISOString().replace(/:/g,"-") +'-' + file.fieldname);;
    }
});

function fileFilter (req, file, cb) {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage, fileFilter});


module.exports = {
    upload,
}