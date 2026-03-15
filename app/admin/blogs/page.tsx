import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Edit, Plus } from "lucide-react";
import DeleteBlogButton from "@/app/admin/blogs/DeleteBlogButton"; // We will create this client component

const prisma = new PrismaClient();

export default async function AdminBlogsPage() {
  const blogs = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Blog / Tin Tức</h1>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Plus size={18} /> Viết Bài Mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-700">Hình ảnh</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Tiêu đề bài viết</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Ngày Đăng</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Chưa có bài viết nào.
                  </td>
                </tr>
              ) : (
                blogs.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-20 h-14 object-cover rounded-md" />
                      ) : (
                        <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {post.title}
                      <div className="text-xs text-gray-500 font-normal mt-1 truncate max-w-xs">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition text-sm font-medium"
                      >
                        <Edit size={16} /> Sửa
                      </Link>
                      <DeleteBlogButton id={post.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
