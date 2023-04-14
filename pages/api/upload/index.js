import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

export const config = {
    api: {
      bodyParser: false
    }
};

export default async function handler(req, res) {
    try{
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            const file = files.image;

            if(!file) {
                res.status(400).send({
                    message: 'No file uploaded'
                });
            }
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif',
                'image/bmp'
            ];
            if(!allowedTypes.includes(file.mimetype)){
                res.status(400).send({
                    message: 'File type not supported'
                });
            }
    
            // Move the file
            try{
                const uploads = path.join(process.env.PWD, 'public', 'uploads');
                const fileName = file.originalFilename.replace(/\s+/g, '-');
                const filePath = path.join(uploads, fileName);
                let urlPath = `/files/${fileName}`;
                if(process.env.NODE_ENV !== 'production'){
                    urlPath = `${process.env.BASE_URL}/uploads/${fileName}`
                }

                const data = fs.readFileSync(file.filepath);
                fs.writeFileSync(filePath, data);
                await fs.unlinkSync(file.filepath);
    
                res.status(200).send({
                    hash: file.md5,
                    name: fileName,
                    url: urlPath
                });
            }catch(ex){
                console.log('Moving uploaded file failed', ex);
                return res.status(400).send({
                    message: 'File upload unsuccessful'
                });
            }
        });
    }catch(ex){
        console.log('File upload failed', ex);
        return res.status(400).send({
            message: 'File upload unsuccessful'
        });
    }
}
