import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('n8n post incoming body:', JSON.stringify(body, null, 2)); // Thêm log toàn bộ body

    // Tự động xử lý nếu n8n gửi sai tên trường (viết thường coverimage -> coverImage)
    const title = body.title;
    const content = body.content;
    const excerpt = body.excerpt || '';
    const coverImage = body.coverImage || body.coverimage || ''; // Chấp nhận cả 2 cách viết
    const providedSlug = body.slug;

    // SEO fields - Chấp nhận cả camelCase và lowercase
    const seoTitle = body.seoTitle || body.seotitle;
    const seoDescription = body.seoDescription || body.seodescription;
    const seoKeyword = body.seoKeyword || body.seokeyword;
    const rawTags = body.tags;

    // 1. Validation cơ bản
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Tiêu đề (title) và nội dung (content) là bắt buộc.' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);

    // 2. Xử lý Tags (Biến chuỗi thành Mảng chuẩn cho Prisma)
    let processedTags: string[] = [];
    if (rawTags) {
      if (Array.isArray(rawTags)) {
        // Nếu đã là mảng, xử lý từng phần tử
        processedTags = rawTags
          .map((t: any) => {
            if (typeof t === 'object' && t !== null) {
              return t.value || t.name || JSON.stringify(t);
            }
            return String(t).trim();
          })
          .filter(Boolean);
      } else if (typeof rawTags === 'string') {
        const trimmed = rawTags.trim();
        // Nếu n8n gửi chuỗi JSON "[tag1, tag2]"
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              processedTags = parsed.map((t: any) => String(t).trim()).filter(Boolean);
            }
          } catch (e) {
            // Nếu parse lỗi, dùng regex bóc tách
            processedTags = trimmed
              .replace(/[\[\]"]/g, '')
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
        } else {
          // Chuỗi phân tách bằng dấu phẩy
          processedTags = trimmed
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean);
        }
      }
    }

    console.log('Processed Tags:', processedTags); // Log ra để kiểm tra

    // 3. Tạo bài viết trong Database
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: String(excerpt),
        content,
        coverImage: String(coverImage),
        tags: processedTags,
        seoTitle: seoTitle ? String(seoTitle) : null,
        seoDescription: seoDescription ? String(seoDescription) : null,
        seoKeyword: seoKeyword ? String(seoKeyword) : null,
      },
    });

    return NextResponse.json(
      { message: 'Tạo bài viết thành công.', post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post via API:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug đã tồn tại.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi Server.', details: error.message },
      { status: 500 }
    );
  }
}