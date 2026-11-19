import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { hasSameOrigin } from '@/lib/admin/request';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const bucketName = 'product-images';
const maxFileSize = 8 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Загрузка фото недоступна: база данных не настроена.' }, { status: 503 });

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Выберите файл изображения.' }, { status: 400 });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: 'Поддерживаются изображения PNG, JPG, WebP и AVIF.' }, { status: 400 });
    if (file.size === 0 || file.size > maxFileSize) return NextResponse.json({ error: 'Размер фото должен быть не больше 8 МБ.' }, { status: 400 });

    const { data: existingBucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    if (!existingBucket) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: maxFileSize,
        allowedMimeTypes: [...allowedTypes],
      });
      if (createError) {
        console.error('Could not initialize product image storage bucket', bucketError?.message, createError.message);
        return NextResponse.json({ error: 'Не удалось подготовить хранилище фото. Проверьте ключ Supabase с правами service_role.' }, { status: 503 });
      }
    }

    const objectPath = `${randomUUID()}.${extensions[file.type]}`;
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(objectPath, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (uploadError) {
      console.error('Could not upload product image', uploadError.message);
      return NextResponse.json({ error: 'Не удалось сохранить фото в хранилище.' }, { status: 502 });
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);
    return NextResponse.json({ imageUrl: data.publicUrl }, { status: 201 });
  } catch (error) {
    console.error('Could not process product image upload', error);
    return NextResponse.json({ error: 'Не удалось обработать файл фото.' }, { status: 400 });
  }
}
