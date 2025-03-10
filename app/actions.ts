// "use server"

// import { revalidatePath } from "next/cache"
// import { PutObjectCommand } from "@aws-sdk/client-s3"

// import crypto from "crypto"
// import { s3Client, BUCKET_NAME } from "@/lib/s3-client"

// export async function uploadImages(formData: FormData) {
//   try {
//     const files = formData.getAll('images') as File[]
    
//     if (!files || files.length === 0) {
//       return { success: false, error: "No files provided" }
//     }

//     if (!BUCKET_NAME) {
//       return { success: false, error: "S3 bucket name is not configured" }
//     }

//     const uploadedImages = await Promise.all(
//       files.map(async (file) => {
//         const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-')
//         const randomId = crypto.randomBytes(8).toString("hex")
//         const timestamp = Date.now()
//         const key = `uploads/${timestamp}-${randomId}-${originalName}`
        
//         // Convertir el archivo a buffer
//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)
        
//         // Subir a S3
//         const command = new PutObjectCommand({
//           Bucket: BUCKET_NAME,
//           Key: key,
//           Body: buffer,
//           ContentType: file.type,
//           // Hacer el objeto públicamente accesible
//           ACL: "public-read",
//         })
        
//         await s3Client.send(command)
        
//         // Generar URL pública
//         const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`
        
//         return {
//           name: file.name,
//           url: publicUrl
//         }
//       })
//     )

//     revalidatePath('/')
    
//     return { 
//       success: true, 
//       images: uploadedImages
//     }
//   } catch (error) {
//     console.log("Error uploading images:", error)
//     return { 
//       success: false, 
//       error: "Failed to upload images" 
//     }
//   }
// }
