import Link from "next/link";
import Image from "next/image";
import type { Metadata } from 'next';
import BlogCard from "@/components/ui/BlogCard";

export const metadata: Metadata = {
  title: 'Blog Review & Tin Tức Bánh Tráng Trộn Ngon Cần Thơ',
  description: 'Tổng hợp chia sẻ, review đánh giá các loại bánh tráng trộn ngon nhất tại Cần Thơ. Kiến thức 100% hữu ích cho tín đồ ăn vặt.',
};

const MOCK_POSTS = [
  {
    title: "Bánh Tráng Trộn Ngon Nhất Cần Thơ — Địa Chỉ & Review 2025",
    slug: "banh-trang-tron-ngon-nhat-can-tho",
    excerpt: "Bài viết tổng hợp chi tiết nhất về tiệm bánh tráng trộn đang làm mưa làm gió tại quận Ninh Kiều...",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    publishedAt: "2025-03-10T08:00:00.000Z"
  },
  {
    title: "Ship Bánh Tráng Trộn Cần Thơ Tận Nơi Siêu Tốc Trong 30 Phút",
    slug: "ship-banh-trang-tron-can-tho",
    excerpt: "Trời mưa thèm ăn vặt? Đừng lo, dịch vụ ship bánh tráng trộn Cần Thơ của chúng tôi sẽ giao hàng tận cửa nhà bạn.",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    publishedAt: "2025-03-10T08:00:00.000Z"
  },
  {
    title: "Nguyên Liệu Bánh Tráng Trộn Chuẩn Vị — Bí Quyết Gây Nghiện",
    slug: "nguyen-lieu-banh-trang-tron-chuan",
    excerpt: "Từ bánh tráng dẻo Tây Ninh đến muối tôm đỏ cay, khám phá những nguyên liệu tạo nên bịch bánh tráng trộn ngon.",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    publishedAt: "2025-03-10T08:00:00.000Z"
  }
];

export default function BlogListing() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Page Header */}
      <div style={{ background: '#A60817' }} className="pt-32 pb-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(255,178,0,0.2)', border: '1px solid #FFB200', color: '#FFB200' }}
          >
            📝 Tin Tức & Review
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Góc Review & Tin Tức <span style={{ color: '#FFB200' }}>Ẩm Thực Mới</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Khám phá những bài viết hay nhất về văn hóa ăn vặt Cần Thơ, bí quyết nhận diện bánh tráng chuẩn vị Tây Ninh.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_POSTS.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
