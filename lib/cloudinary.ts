import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are missing');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadResumePdfToCloudinary = (buffer: Buffer, originalFilename: string): Promise<UploadApiResponse> =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'maxapp/resumes',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true,
        filename_override: originalFilename,
        format: 'pdf'
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Missing Cloudinary upload result'));
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

export const deleteResumeFromCloudinary = (publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> =>
  cloudinary.uploader.destroy(publicId, {
    resource_type: 'raw',
    invalidate: true
  });

export { cloudinary };
