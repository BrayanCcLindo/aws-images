"use client"

import { useState } from "react"
import { Upload, Link, ExternalLink, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImageUploader from "@/components/imageUploader"
import Image from "next/image"

export default function Home() {
  
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
console.log(isUploading, 'isUploading');

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })
      
      // Usar la API route que creamos
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUploadedImages(prev => [...prev, ...result.images])
      } else {
        setError(result.error || "Error al subir las imágenes")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      setError("Error al subir las imágenes. Por favor, inténtalo de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Subir y Compartir Imágenes</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr]">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Imágenes
            </h2>
            
            <ImageUploader onUpload={handleUpload} isUploading={isUploading} />
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              Enlaces de Imágenes
            </h2>
{isUploading ? (
      Array.from({ length: uploadedImages.length + 1 }).map((_, index) => (

  <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg animate-pulse">
  <div className="sm:w-1/3 flex-shrink-0 bg-muted rounded-md aspect-square flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
  <div className="sm:w-2/3 flex flex-col justify-between">
    <div>
      <div className="h-5 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full mt-2"></div>
    </div>
    <div className="flex gap-2 mt-3">
      <div className="h-8 bg-muted rounded flex-1"></div>
      <div className="h-8 bg-muted rounded flex-1"></div>
            </div>
      </div>
      </div>
    ))
) : uploadedImages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
    Las imágenes subidas aparecerán aquí con sus enlaces
  </div>
) : (
  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
    {uploadedImages.map((image, index) => (
      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
        <div className="sm:w-1/3 flex-shrink-0">
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.name}
            width={200}
            height={200}
            className="w-full h-auto rounded-md object-cover aspect-square"
          />
        </div>
        <div className="sm:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="font-medium truncate" title={image.name}>
              {image.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 break-all">
              {image.url}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => copyToClipboard(image.url)}
            >
              {copied === image.url ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => window.open(image.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
          </Card>
        </div>
      </div>
    </main>
  )
}
