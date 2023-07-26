const multer = require('multer');

// The storage object is defined using multer.diskStorage, which provides a way to specify the destination directory and filename for uploaded files.
const storage = multer.diskStorage({
    //  This function determines the destination directory where uploaded files will be stored. In this example, it sets the destination to the 'uploads' directory. 
    // The cb callback function is invoked with null as the error parameter and the destination directory as the second parameter.
    destination: (req,file,cb) =>{
        cb(null, 'uploads'); 
    },
    // This function determines the filename for the uploaded file. In this example, it generates a filename based on the current date and time using 
    // Then, replace(/:/g, '-') replaces all occurrences of : in the string with - to ensure the filename doesn't contain any colons.
    filename: (req,file,cb) =>{
        cb(null, new Date().toISOString().replace(/:/g,"-") + "-"  + file.originalname);
    }
});

//Specify file format that can be saved
// By defining a fileFilter function and passing it to the multer middleware, you can enforce file type restrictions for uploaded files. 
// Only files with the specified MIME types (in this case, PNG, JPG, or JPEG) will be accepted, while others will be rejected.

function fileFilter (req, file, cb) {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } 
    else {
        cb(null, false);
    }
}

const upload = multer({storage, fileFilter});


module.exports = {
    upload,
}