"use client";

import { useState } from "react";
import { uploadProductImage } from "@/lib/actions/upload";

export default function ImageUploadField({ initialUrl }: { initialUrl?: string }) {
  const [imageUrl, setImageUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      setImageUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-brand-ink-soft">Foto del producto</label>

      <div className="flex items-start gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-brand-line bg-brand-blue-light">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Vista previa" className="h-full w-full object-contain p-2" />
          ) : (
            <span className="px-2 text-center text-[10px] text-brand-ink-soft">Sin foto</span>
          )}
        </div>

        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-brand-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-ink hover:border-brand-blue">
            {uploading ? "Subiendo…" : imageUrl ? "Cambiar imagen" : "Subir imagen"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-xs text-brand-ink-soft">JPG, PNG, WEBP o AVIF. Máximo 5 MB.</p>
          {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>

      {/* Este input oculto es el que en realidad viaja con el formulario */}
      <input type="hidden" name="imageUrl" value={imageUrl} />
    </div>
  );
}
