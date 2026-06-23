'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > max) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }

    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        urls.push(data.url);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (urls.length) onChange([...images, ...urls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-brand-700 text-white text-[9px] text-center font-bold py-0.5">
                MAIN
              </span>
            )}
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Upload size={18} />
                <span className="text-[10px] mt-1 font-medium">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      <p className="text-xs text-gray-400">
        JPG, PNG, WebP · Max 10 MB each · First image is shown as main
      </p>
    </div>
  );
}
