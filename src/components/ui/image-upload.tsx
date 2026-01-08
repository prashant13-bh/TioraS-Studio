'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { initializeFirebase } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
  disabled?: boolean;
}

export function ImageUpload({
  onChange,
  onRemove,
  value,
  disabled
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);

      const { firebaseApp } = initializeFirebase();
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Image upload failed');
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setIsUploading(false);
          toast.success('Image uploaded successfully');
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong');
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-muted">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') ? (
              <video
                src={url}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <Image
                fill
                className="object-cover"
                alt="Media"
                src={url}
              />
            )}
          </div>
        ))}
      </div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-10 hover:bg-muted/50 transition
          flex flex-col justify-center items-center gap-4 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="w-full max-w-xs space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            <div className="p-4 bg-background rounded-full border shadow-sm">
              <ImagePlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                Images (JPG, PNG) or Videos (MP4, WebM) - max 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
