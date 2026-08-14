"use client"
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('web_images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('web_images')
        .getPublicUrl(filePath)

      onChange(publicUrlData.publicUrl)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }, [onChange, supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  return (
    <div className="w-full">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Cambiar Imagen
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 mb-3 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium mb-1">
                  {isDragActive ? "Suelta la imagen aquí" : "Arrastra y suelta tu imagen aquí"}
                </p>
                <p className="text-xs opacity-80">o haz clic para seleccionar</p>
              </>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
