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

    // Tự động xử lý nếu n8n gửi sai tên trường (viết thường coverimage -> coverImage)
    const title = body.title;
    const content = body.content;
    const excerpt = body.excerpt || '';
    const coverImage = body.coverImage || body.coverimage || ''; // Chấp nhận cả 2 cách viết
    const providedSlug = body.slug;
    const seoTitle = body.seoTitle;
    const seoDescription = body.seoDescription;
    const seoKeyword = body.seoKeyword;
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
    if (Array.isArray(rawTags)) {
      processedTags = rawTags.map((t: any) => String(t).trim()).filter(Boolean);
    } else if (typeof rawTags === 'string') {
      // Nếu n8n gửi "[tag1, tag2]" dưới dạng string, code này sẽ bóc tách ra
      processedTags = rawTags
        .replace(/[\[\]"]/g, '') // Xóa dấu ngoặc vuông và ngoặc kép nếu có
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

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