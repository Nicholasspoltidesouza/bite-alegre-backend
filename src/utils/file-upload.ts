import { randomUUID } from 'node:crypto';
import path from 'node:path';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { Express } from 'express-serve-static-core';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadMediaToS3(
  file: Express.Multer.File,
): Promise<string> {
  const ext = path.extname(file.originalname);
  const key = `publications/${randomUUID()}${ext}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000',
        ContentDisposition: 'inline',
      }),
    );

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  } catch (err) {
    console.error('Falha no upload S3:', err);
    throw new Error('Falha no upload da mídia');
  }
}

export function getLocalFileUrl(file: Express.Multer.File): string {
  const extension = file.originalname.split('.').pop() || 'jpg';
  return `https://via.placeholder.com/400x300.${extension}?text=Mock+Image+(${file.originalname})`;
}
