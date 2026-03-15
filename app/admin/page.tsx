import { ShoppingBag, FileText, TrendingUp, Users } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const productsCount = await prisma.menuItem.count();
  const blogsCount = await prisma.post.count();

  const STATS = [
    { label: "Tổng Sản Phẩm", value: productsCount, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Bài Viết Blog", value: blogsCount, icon: FileText, color: "text-green-600", bg: "bg-green-100" },
    { label: "Lượt Truy Cập", value: "1,245", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Khách Hàng Mới", value: "48", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tổng Quan Quản Trị</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-gray-700"
          >
            + Thêm Sản Phẩm Mới
          </Link>
          <Link
            href="/admin/blogs/new"
            className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-gray-700"
          >
            + Viết Bài Blog Mới
          </Link>
        </div>
      </div>
    </div>
  );
}
