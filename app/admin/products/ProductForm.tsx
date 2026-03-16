'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createProduct, updateProduct } from './actions';

type MenuItem = {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  slug: string;
};

export default function ProductForm({ initialData }: { initialData?: MenuItem }) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (isEditing && initialData?.id) {
        res = await updateProduct(initialData.id, formData);
      } else {
        res = await createProduct(formData);
      }

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      }
      // If successful, the server action will redirect
    } catch (err) {
      setError('Đã xảy ra lỗi không xác định.');
      setIsLoading(false);
    }
  }

  // Auto-generate slug from name
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEditing) {
      const name = e.target.value;
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD') // Normalize to separate accents
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars exept spaces/hyphens
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Collapse multiple hyphens
      
      const slugInput = document.getElementById('slug') as HTMLInputElement;
      if (slugInput) slugInput.value = generatedSlug;
    }
  }

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Link href="/admin/products" className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
          </h1>
        </div>

        <div className="bg-white overflow-hidden shadow sm:rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      defaultValue={initialData?.name}
                      onChange={handleNameChange}
                      className="shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="1000"
                      defaultValue={initialData?.price}
                      className="shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="category"
                      id="category"
                      required
                      defaultValue={initialData?.category ?? 'Bánh Tráng'}
                      className="shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    URL Slug (duy nhất)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      required
                      defaultValue={initialData?.slug}
                      readOnly={isEditing}
                      className={`shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Đường dẫn thân thiện (vd: banh-trang-tron).</p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    URL Hình ảnh
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="imageUrl"
                      id="imageUrl"
                      required
                      defaultValue={initialData?.imageUrl}
                      placeholder="https://example.com/image.jpg"
                      className="shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      defaultValue={initialData?.description}
                      className="shadow-sm focus:ring-[#FE5200] focus:border-[#FE5200] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200 flex justify-end">
                <Link
                  href="/admin/products"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE5200] mr-3"
                >
                  Huỷ
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#A60817] hover:bg-[#8A0613] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A60817] disabled:opacity-50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang lưu...' : 'Lưu Sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
