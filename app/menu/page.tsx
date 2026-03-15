import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from 'next';
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Thực Đơn Bánh Tráng Trộn Ngon Cần Thơ | Giá Rẻ, Đa Dạng',
  description: 'Khám phá hơn 20 loại bánh tráng trộn, nướng, cuốn tại tiệm ngon nhất Ninh Kiều Cần Thơ. Giá chỉ từ 15k. Xem ngay menu!',
};

const MENU_PRODUCTS = [
  {
    category: "Bánh Tráng Trộn",
    items: [
      {
        slug: "banh-trang-tron-thap-cam",
        name: "Bánh Tráng Trộn Thập Cẩm Đặc Biệt",
        description: "Khô bò, khô mực, trứng cút, xoài, đậu phộng, hành phi.",
        price: 35000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
      {
        slug: "banh-trang-tron-kho-bo",
        name: "Bánh Tráng Trộn Khô Bò Đen",
        description: "Khô bò đen thượng hạng, cay nức mũi.",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
      {
        slug: "banh-trang-tron-trung-cut",
        name: "Bánh Tráng Trộn Trứng Cút",
        description: "Trứng cút luộc mềm, phủ sốt đặc biệt cay chua đậm đà.",
        price: 20000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
      {
        slug: "banh-trang-tron-xoai",
        name: "Bánh Tráng Trộn Xoài Xanh",
        description: "Xoài xanh chua giòn hòa quyện muối tôm đỏ cay cực kỳ kích thích vị giác.",
        price: 15000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
    ]
  },
  {
    category: "Bánh Tráng Cuốn",
    items: [
      {
        slug: "banh-trang-cuon-sot-me",
        name: "Bánh Cuốn Bơ Sốt Me",
        description: "Cuốn dài 20cm, chấm sốt me chua cay cực dính.",
        price: 30000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      },
      {
        slug: "banh-trang-cuon-sot-bo",
        name: "Bánh Cuốn Chấm Bơ Tỏi",
        description: "Bơ béo ngậy quện cùng tỏi phi giòn rụm.",
        price: 30000,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
      }
    ]
  }
];

export default function MenuPage() {
  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Page Header */}
      <div style={{ background: '#A60817' }} className="pt-32 pb-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(255,178,0,0.2)', border: '1px solid #FFB200', color: '#FFB200' }}
          >
            🍽️ Thực Đơn
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Thực Đơn Đa Dạng
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Giao hàng siêu tốc khu vực Cần Thơ. Đặt món ngay để thưởng thức hương vị đặc trưng!
          </p>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-16">
          {MENU_PRODUCTS.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-4 mb-8">
                <h2
                  className="text-3xl font-bold text-gray-900 pb-2 border-b-4 inline-block"
                  style={{ fontFamily: 'Poppins, sans-serif', borderColor: '#A60817' }}
                >
                  {section.category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map(product => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-12 text-center">
        <Link
          href="/lien-he"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #A60817, #FE5200)' }}
        >
          Đặt Hàng Ngay <ChevronRight size={18} />
        </Link>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            MENU_PRODUCTS.flatMap(section =>
              section.items.map(product => ({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "image": product.imageUrl,
                "description": product.description,
                "brand": {
                  "@type": "Brand",
                  "name": "Bánh Tráng Trộn Cần Thơ"
                },
                "offers": {
                  "@type": "Offer",
                  "url": `https://banhtrangtronngoncantho.vn/menu/${product.slug}`,
                  "priceCurrency": "VND",
                  "price": product.price,
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": "https://schema.org/InStock"
                }
              }))
            )
          )
        }}
      />
    </div>
  );
}
