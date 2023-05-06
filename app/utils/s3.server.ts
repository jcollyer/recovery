import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.RECOVERY_BUCKET_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.RECOVERY_ACCESS_KEY_ID!,
    secretAccessKey:process.env.RECOVERY_SECRET_ACCESS_KEY!
  }
});


export { s3Client };