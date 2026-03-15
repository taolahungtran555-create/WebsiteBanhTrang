const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOT_PRODUCTS = [
  {
    slug: "banh-trang-tron-thap-cam",
    name: "Bánh Tráng Trộn Thập Cẩm Đặc Biệt",
    description: "Đầy đủ topping: khô bò, khô mực, trứng cút, xoài xanh, đậu phộng rang giòn và nước sốt độc quyền.",
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    category: "Bánh Tráng Trộn"
  },
  {
    slug: "banh-trang-tron-kho-bo",
    name: "Bánh Tráng Trộn Khô Bò Đen",
    description: "Khô bò đen thượng hạng, cay nức mũi, kết hợp bánh tráng dẻo Tây Ninh.",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    category: "Bánh Tráng Trộn"
  },
  {
    slug: "banh-trang-cuon-sot-me",
    name: "Bánh Tráng Cuốn Sốt Me",
    description: "Bánh tráng cuốn bơ tép mỡ, chấm cùng sốt me chua ngọt đậm đà khó cưỡng.",
    price: 30000,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    category: "Bánh Tráng Cuốn"
  },
  {
    slug: "banh-trang-nuong-pho-mai",
    name: "Bánh Tráng Nướng Phô Mai",
    description: "Bánh tráng giòn nướng than hoa, phủ phô mai béo ngậy và sa tế cay thơm.",
    price: 20000,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    category: "Bánh Tráng Nướng"
  },
];

const BLOG_POSTS = [
  {
    slug: "banh-trang-tron-ngon-nhat-can-tho",
    title: "Bánh Tráng Trộn Ngon Nhất Cần Thơ — Địa Chỉ & Review 2025",
    excerpt: "Bài viết tổng hợp chi tiết nhất về tiệm bánh tráng trộn đang làm mưa làm gió tại quận Ninh Kiều...",
    content: "Nội dung bài viết chi tiết sẽ được cập nhật sau...",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    tags: ["Review", "Cần Thơ", "Top List"]
  },
  {
    slug: "ship-banh-trang-tron-can-tho",
    title: "Ship Bánh Tráng Trộn Cần Thơ Tận Nơi Siêu Tốc Trong 30 Phút",
    excerpt: "Trời mưa thèm ăn vặt? Đừng lo, dịch vụ ship bánh tráng trộn Cần Thơ của chúng tôi sẽ giao hàng tận cửa nhà bạn.",
    content: "Nội dung bài viết chi tiết sẽ được cập nhật sau...",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    tags: ["Dịch vụ", "Ship tận nơi"]
  },
  {
    slug: "nguyen-lieu-banh-trang-tron-chuan",
    title: "Nguyên Liệu Bánh Tráng Trộn Chuẩn Vị — Bí Quyết Gây Nghiện",
    excerpt: "Từ bánh tráng dẻo Tây Ninh đến muối tôm đỏ cay, khám phá những nguyên liệu tạo nên bịch bánh tráng trộn ngon.",
    content: "Nội dung bài viết chi tiết sẽ được cập nhật sau...",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    tags: ["Nguyên liệu", "Bí quyết"]
  }
];

async function main() {
  console.log('Seeding Database...');

  for (const product of HOT_PRODUCTS) {
    await prisma.menuItem.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  for (const post of BLOG_POSTS) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
