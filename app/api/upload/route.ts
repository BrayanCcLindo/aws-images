import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import crypto from 'crypto';

// Configurar AWS SDK
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION || 'us-east-1',
});

const s3 = new AWS.S3();

// Función para convertir un ReadableStream a un Buffer
// async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
//   const reader = stream.getReader();
//   const chunks: Uint8Array[] = [];

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     chunks.push(value);
//   }

//   return Buffer.concat(chunks);
// }

// // Función para convertir un Buffer a un Readable stream (para multer)
// function bufferToStream(buffer: Buffer): Readable {
//   const readable = new Readable();
//   readable.push(buffer);
//   readable.push(null);
//   return readable;
// }

export async function POST(request: NextRequest) {
  try {
    // Verificar que el bucket está configurado
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { success: false, error: 'S3 bucket name is not configured' },
        { status: 500 }
      );
    }

    // Obtener el FormData de la solicitud
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Procesar cada archivo y subirlo a S3
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
        const randomId = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const key = `uploads/${timestamp}-${randomId}-${originalName}`;

        // Convertir el archivo a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Subir a S3 usando aws-sdk
        const params = {
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ACL: 'public-read', // Hacer el objeto públicamente accesible
        };

        await s3.upload(params).promise();

        // Generar URL pública
        const publicUrl = `https://${bucketName}.s3.${
          process.env.NEXT_PUBLIC_AWS_S3_REGION || 'us-east-1'
        }.amazonaws.com/${key}`;

        return {
          name: file.name,
          url: publicUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
