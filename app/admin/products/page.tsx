import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Edit, Trash2, Plus } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton"; // We will create this client component

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.menuItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Plus size={18} /> Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-700">Hình ảnh</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Tên Sản Phẩm</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Giá</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Danh Mục</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                      <div className="text-xs text-gray-500 font-normal mt-1">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {product.category || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition text-sm font-medium"
                      >
                        <Edit size={16} /> Sửa
                      </Link>
                      <DeleteProductButton id={product.id} />
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
