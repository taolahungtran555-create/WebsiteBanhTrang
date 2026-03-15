"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminProductNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if typing name and slug is empty
    if (name === "name" && !formData.slug) {
      const generatedSlug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Lỗi: ${error.error || "Không thể tải lên."}`);
      }
    } catch (error) {
      alert("Lỗi kết nối.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm hover:shadow">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="VD: Bánh Tráng Trộn Thập Cẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn tĩnh (Slug) *</label>
            <input
              required
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-gray-50"
              placeholder="VD: banh-trang-tron-thap-cam"
            />
            <p className="text-xs text-gray-500 mt-1">Dùng cho URL: /menu/slug</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VND) *</label>
            <input
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="VD: 35000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="VD: Bánh Tráng Trộn, Bánh Tráng Nướng..."
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={formData.imageUrl} alt="Preview" className="h-32 object-cover rounded-lg border border-gray-200" />
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-y"
              placeholder="Mô tả nguyên liệu, hương vị..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? "Đang lưu..." : "Lưu Sản Phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
