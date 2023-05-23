import { createReadStream } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { formidable } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Parse the file input form
    try {
        const form = formidable({ multiples: false });
        const formfields = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });
        });

        // Setup the S3 upload
        const file = formfields.image;
        const fileExt = (/[^./\\]*$/.exec(file.originalFilename) || [''])[0];
        const s3Client = new S3Client({});
        const s3Bucket = process.env.S3_BUCKET_NAME;
        const fileUUID = uuidv4();
        const fileName = `${fileUUID}.${fileExt}`;

        // Upload the file
        const uploadCommand = new PutObjectCommand({
            Bucket: s3Bucket,
            Key: fileName,
            Body: createReadStream(file.filepath),
            ACL: 'public-read',
            ContentType: file.mimetype,
        });
        const response = await s3Client.send(uploadCommand);

        // Set the image URL to the client
        response.url = `https://${s3Bucket}.s3.amazonaws.com/${fileName}`;

        // Return response
        return res.json(response);
    } catch (ex) {
        console.log('Error uploading file', ex);
        return res.json({
            error: 'Unable to upload file. Please check your config and try again.',
        });
    }
}
