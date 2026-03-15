import Image from "next/image";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";

// For real environment, params would be fetched from DB.
export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  // Fake DB check
  if (!slug) return {};

  const title = `Chia sẻ chi tiết về: ${slug.replace(/-/g, ' ')}`;
  
  return {
    title: `${title} | Bánh Tráng Trộn Ngon Cần Thơ`,
    description: `Khám phá bài viết chuyên sâu về ${title.toLowerCase()} tại tiệm bánh tráng trộn ngon nhất Cần Thơ.`,
    alternates: {
      canonical: `https://banhtrangtronngoncantho.vn/tin-tuc/${slug}`,
    }
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  if (!slug) notFound();

  const title = "Bánh Tráng Trộn Ngon Nhất Cần Thơ — Địa Chỉ & Review 2025";
  const image = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

  return (
    <article className="bg-white min-h-screen">
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-neutral-900">
        <Image 
          src={image}
          alt={title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center max-w-4xl text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight shadow-md">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-lg md:prose-xl prose-orange mx-auto">
          <h2>Bánh tráng trộn Cần Thơ có gì đặc biệt?</h2>
          <p>
            Nhắc đến món ăn vặt quốc dân không thể bỏ qua <strong>bánh tráng trộn Cần Thơ</strong>. Dù món này xuất phát từ Tây Ninh, Sài Gòn nhưng khi về miền Tây, đặc biệt là xứ gạo trắng nước trong, hương vị đã được biến tấu ngọt ngào và đậm đà hơn hẳn.
          </p>
          <p>
            Với nước sốt me đặc trưng hoặc sốt khô bò cay xè, một phần bánh tráng ở đây luôn trong tình trạng ngập ngụa topping: trứng cút, khô gà, khô mực, đậu phộng rang... ăn một miếng là ghiền.
          </p>
          <h3>Vì sao giới trẻ Cần Thơ ưa chuộng tiệm của chúng tôi?</h3>
          <ul>
            <li>Giao hàng <strong>ship bánh tráng trộn Cần Thơ tận nhà</strong> nhanh chóng chỉ trong 15-30 phút.</li>
            <li>Nguyên liệu chuẩn loại 1, đảm bảo vệ sinh ATTP.</li>
            <li>Menu linh hoạt cho phép thêm bớt độ mặn/ngọt theo ý thích.</li>
          </ul>
          <h3>Kết Luận</h3>
          <p>
            Chưa thử là một thiếu sót siêu to khổng lồ. Hãy đặt ngay qua hotline 0123 456 789 để kiểm chứng vị ngon này nhé!
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [image],
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "author": [{
                "@type": "Person",
                "name": "Bánh Tráng Trộn Ngon Cần Thơ",
                "url": "https://banhtrangtronngoncantho.vn"
            }]
          })
        }}
      />
    </article>
  );
}
