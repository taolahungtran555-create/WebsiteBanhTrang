"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminBlogNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "", // We'll handle tags as a comma-separated string in the form
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      const generatedSlug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, title: value, slug: generatedSlug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push("/admin/blogs");
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
        <Link href="/admin/blogs" className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm hover:shadow">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Viết Bài Blog Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="VD: Top 5 món bánh tráng ngon nhất..."
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
              placeholder="VD: top-5-mon-banh-trang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thẻ (Tags)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="VD: Cần Thơ, Review, Bánh tráng (cách nhau dấu phẩy)"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh Bìa</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
            {formData.coverImage && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={formData.coverImage} alt="Preview" className="h-48 w-full object-cover rounded-lg border border-gray-200" />
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Đoạn trích (Mô tả ngắn)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-y"
              placeholder="Hiển thị ngoài trang chủ..."
            ></textarea>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết *</label>
            <textarea
              required
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-y"
              placeholder="Viết nội dung bài đăng ở đây..."
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
            {isSubmitting ? "Đang xuất bản..." : "Xuất Bản Bài Viết"}
          </button>
        </div>
      </form>
    </div>
  );
}
