"use client";

import { Check, GripVertical, ImagePlus, Star, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface UploadImageItem {
  id?: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
  variantId?: string | null;
  file?: File;
}

export function ImageUploader({
  value,
  onChange,
}: {
  value: UploadImageItem[];
  onChange: (images: UploadImageItem[]) => void;
}) {
  const onDrop = (acceptedFiles: File[]) => {
    const next = acceptedFiles.slice(0, 6 - value.length).map((file, index) => ({
      id: undefined,
      url: URL.createObjectURL(file),
      altText: file.name,
      isPrimary: value.length === 0 && index === 0,
      displayOrder: value.length + index,
      variantId: null,
      file,
    }));
    onChange([...value, ...next]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [] }, maxFiles: 6 });

  const removeImage = (index: number) => {
    const next = value.filter((_, currentIndex) => currentIndex !== index).map((image, currentIndex) => ({
      ...image,
      isPrimary: currentIndex === 0,
      displayOrder: currentIndex,
    }));
    onChange(next);
  };

  const updateImage = (index: number, patch: Partial<UploadImageItem>) => {
    onChange(
      value.map((image, currentIndex) =>
        currentIndex === index
          ? {
              ...image,
              ...patch,
            }
          : image,
      ),
    );
  };

  const setPrimary = (index: number) => {
    const selected = value[index];
    const rest = value.filter((_, currentIndex) => currentIndex !== index);
    const next = [selected, ...rest].map((image, currentIndex) => ({
      ...image,
      isPrimary: currentIndex === 0,
      displayOrder: currentIndex,
    }));
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 text-center transition hover:border-coral/50 hover:bg-coral/5">
        <input {...getInputProps()} />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 text-coral">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-800">Upload product gallery</p>
        <p className="mt-1 text-xs text-slate-500">PNG, JPG, or WEBP. Up to 6 images. The first image becomes the storefront cover.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {value.map((image, index) => (
          <div key={`${image.url}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100">
              <Image src={image.url} alt={image.altText ?? `Image ${index + 1}`} fill className="object-cover" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                {image.isPrimary ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900">
                    <Star className="h-3 w-3 fill-current text-amber-500" />
                    Primary
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <GripVertical className="h-3.5 w-3.5" />
                  Image #{index + 1}
                </span>
                <Button size="icon" variant="ghost" type="button" onClick={() => removeImage(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={image.altText ?? ""}
                onChange={(event) => updateImage(index, { altText: event.target.value })}
                placeholder="Alt text for accessibility"
              />
              <div className="flex items-center justify-between gap-2">
                <Button type="button" variant={image.isPrimary ? "secondary" : "outline"} size="sm" onClick={() => setPrimary(index)}>
                  {image.isPrimary ? <Check className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
                  {image.isPrimary ? "Primary image" : "Set as primary"}
                </Button>
                <span className="text-xs text-slate-500">{image.file ? "Ready to upload" : "Saved image"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
