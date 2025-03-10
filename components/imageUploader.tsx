"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface ImageUploaderProps {
  onUpload: (files: File[]) => void
  isUploading: boolean
}

export default function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    const newPreviews = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleUpload = () => {
    if (previews.length === 0) return

    onUpload(previews.map((p) => p.file))

    // Clear previews after upload
    previews.forEach((p) => URL.revokeObjectURL(p.preview))
    setPreviews([])
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2 py-4 cursor-pointer">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Arrastra y suelta tus imágenes</h3>
          <p className="text-sm text-muted-foreground">o haz clic para seleccionar archivos</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Vista previa ({previews.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview.preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removePreview(index)
                  }}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {preview.file.name}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <span className="mr-2">Subiendo...</span>
                <Progress value={45} className="w-16 h-2" />
              </>
            ) : (
              <>
                Subir {previews.length} {previews.length === 1 ? "imagen" : "imágenes"}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

