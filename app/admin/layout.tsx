import Link from "next/link";
import { LayoutDashboard, ShoppingBag, FileText, Home } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold">
            A
          </div>
          <span className="text-xl font-bold text-gray-800">Admin Area</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
          >
            <ShoppingBag size={20} />
            Sản Phẩm (Menu)
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
          >
            <FileText size={20} />
            Tin Tức (Blog)
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            <Home size={20} />
            Quay lại Website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
