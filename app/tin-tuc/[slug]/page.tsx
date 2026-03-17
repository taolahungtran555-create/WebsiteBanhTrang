import Image from "next/image";
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug) return {};

  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post) return {};
  
  return {
    title: `${post.title} | Bánh Tráng Trộn Ngon Cần Thơ`,
    description: post.excerpt,
    alternates: {
      canonical: `https://banhtrangtronngoncantho.vn/tin-tuc/${slug}`,
    }
  };
}

export default async function BlogPost({ params }: any) {
  const { slug } = await params;
  
  if (!slug) notFound();

  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post) notFound();

  const title = post.title;
  const image = post.coverImage || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop";

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
        <div 
          className="prose prose-lg md:prose-xl prose-orange mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [image],
            "datePublished": post.publishedAt.toISOString(),
            "dateModified": post.updatedAt.toISOString(),
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
