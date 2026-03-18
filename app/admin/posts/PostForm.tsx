'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createPost, updatePost } from './actions';
import Image from 'next/image';

type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
};

export default function PostForm({ initialData }: { initialData?: Post }) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!coverImage) {
      setError('Vui lòng tải lên ảnh bìa.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('coverImage', coverImage);

    try {
      let res;
      if (isEditing && initialData?.id) {
        res = await updatePost(initialData.id, formData);
      } else {
        res = await createPost(formData);
      }

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch {
      setError('Đã xảy ra lỗi không xác định.');
      setIsLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    setIsUploading(true);
    setError('');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = 'ml_default'; // Standard unsigned preset name

    if (!cloudName) {
      setError('Lỗi: Biến môi trường NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME chưa được tải. Nếu bạn vừa đổi file .env, vui lòng tắt terminal và chạy lại lệnh "npm run dev".');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'blog_posts');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setCoverImage(data.secure_url);
      } else if (data.error) {
        setError(`Lỗi Cloudinary: ${data.error.message}`);
        console.error('Cloudinary Error:', data.error);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối khi tải ảnh lên.');
      console.error('Upload Fetch Error:', err);
    } finally {
      setIsUploading(false);
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEditing) {
      const title = e.target.value;
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const slugInput = document.getElementById('slug') as HTMLInputElement;
      if (slugInput) slugInput.value = generatedSlug;
    }
  }

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        {/* ... existing header ... */}
        <div className="mb-6 flex items-center">
          <Link href="/admin/posts" className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-be-vietnam-pro), "Be Vietnam Pro", sans-serif' }}>
            {isEditing ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
          </h1>
        </div>

        <div className="bg-white overflow-hidden shadow sm:rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Title & Slug */}
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề bài viết <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      defaultValue={initialData?.title}
                      onChange={handleTitleChange}
                      placeholder="Nhập tiêu đề bài viết..."
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      required
                      defaultValue={initialData?.slug}
                      readOnly={isEditing}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                {/* Cover Image Upload (New Robust Method) */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh bìa <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-48 h-32 relative rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden group">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt="Cover Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gray-300 w-12 h-12" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label
                          htmlFor="cover-upload"
                          className={`inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {coverImage ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Khuyên dùng ảnh tỉ lệ 16:9, dung lượng tối đa 5MB.
                      </p>
                      <input type="hidden" name="coverImage" value={coverImage} />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="sm:col-span-6">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      defaultValue={initialData?.tags?.join(', ')}
                      placeholder="bánh tráng, ẩm thực, Cần Thơ"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="sm:col-span-6">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                    Tóm tắt (excerpt) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows={3}
                      required
                      defaultValue={initialData?.excerpt}
                      placeholder="Mô tả ngắn gọn về nội dung bài viết (hiển thị ở trang danh sách)..."
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="sm:col-span-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Nội dung bài viết <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="content"
                      name="content"
                      rows={16}
                      required
                      defaultValue={initialData?.content}
                      placeholder="Viết nội dung bài viết đầy đủ tại đây..."
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border font-mono text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Hỗ trợ văn bản thuần. Xuống dòng bằng Enter.</p>
                </div>

              </div>

              <div className="pt-5 border-t border-gray-200 flex justify-end">
                <Link
                  href="/admin/posts"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Huỷ
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang lưu...' : 'Lưu Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
