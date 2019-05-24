const multer = require('multer');
const storageImage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/images/')
    },
    filename:(req, file, cb)=>{
        cb(null,Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg'){
        return cb(null,true)
    }
    return cb(new Error('File not allow!'))
}
const upload = multer({
    storage: storageImage,
    fileFilter,
    limits:{fileSize:100*1024} //100kb
});

module.exports = upload;