import { S3Client } from "@aws-sdk/client-s3"

// Crear una instancia del cliente S3
export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION || "us-east-1",
  credentials: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID && process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      }
    : undefined, // En producción, usará las credenciales del rol IAM
})

// Nombre del bucket
export const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || ""
