import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { PlanLimitNotice } from '@/components/ui/PlanLimitNotice'

export default async function ImagesPage() {
  const supabase = await createClient()
  const [{ data: images }, { data: tenant }] = await Promise.all([
    supabase.from('images').select('*').order('created_at', { ascending: false }),
    supabase.from('tenant_settings').select('subscription_plan').limit(1).single(),
  ])
  const imagesCount = images?.length || 0
  const maxImages = 20
  const canUpload = imagesCount < maxImages

  async function uploadImage(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const file = formData.get('image') as File
    const description = formData.get('description') as string

    if (!file) return

    // Re-verify limit on server side
    const { count } = await supabase.from('images').select('*', { count: 'exact', head: true })
    if (count && count >= maxImages) return // Throw error or redirect

    const fileName = `${Date.now()}-${file.name}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('web_images')
      .upload(`public/${fileName}`, file)

    if (uploadData && !uploadError) {
      const { data: publicUrlData } = supabase.storage.from('web_images').getPublicUrl(`public/${fileName}`)
      
      // Save metadata to database
      await supabase.from('images').insert({
        storage_path: `public/${fileName}`,
        url: publicUrlData.publicUrl,
        description
      })

      revalidatePath('/dashboard/images')
    }
  }

  async function deleteImage(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const storage_path = formData.get('storage_path') as string

    if (id && storage_path) {
      await supabase.storage.from('web_images').remove([storage_path])
      await supabase.from('images').delete().eq('id', id)
      revalidatePath('/dashboard/images')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Imágenes</h1>
          <p className="text-zinc-400 mt-2">Gestiona las imágenes de tu web.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-400 mb-1">Límite de Imágenes</p>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${imagesCount >= maxImages ? 'bg-red-500' : 'bg-indigo-500'}`} 
                style={{ width: `${(imagesCount / maxImages) * 100}%` }}
              />
            </div>
            <span className="text-white font-bold">{imagesCount} / {maxImages}</span>
          </div>
        </div>
      </div>

      {canUpload ? (
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
          <form action={uploadImage} className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Subir nueva imagen</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  required
                  className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors file:cursor-pointer"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="description" 
                  placeholder="Descripción (opcional)" 
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20 mt-7">
              <Upload className="w-5 h-5" />
              Subir
            </button>
          </form>
        </div>
      ) : (
        <PlanLimitNotice resource="imágenes" limit={maxImages} plan={tenant?.subscription_plan} />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {images?.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img.url} 
              alt={img.description || 'Imagen'} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-sm font-medium truncate mb-2">{img.description || 'Sin descripción'}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors border border-zinc-600 flex items-center justify-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Copiar URL
                </button>
                <form action={deleteImage}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="storage_path" value={img.storage_path} />
                  <button type="submit" className="px-3 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!images?.length && (
        <div className="py-12 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
          No hay imágenes subidas.
        </div>
      )}
    </div>
  )
}
