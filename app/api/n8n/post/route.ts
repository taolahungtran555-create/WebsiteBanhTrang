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
    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      slug: providedSlug,
      seoTitle,
      seoDescription,
      seoKeyword,
    } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Tiêu đề (title) và nội dung (content) là bắt buộc.' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);

    // Filter and sanitize tags if they are provided
    const processedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || '',
        tags: processedTags,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeyword: seoKeyword || null,
      },
    });

    return NextResponse.json(
      { message: 'Tạo bài viết thành công.', post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post via API:', error);

    // Check for unique constraint violation on slug
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug đã tồn tại. Vui lòng cung cấp tiêu đề khác hoặc slug duy nhất.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo bài viết.', details: error.message },
      { status: 500 }
    );
  }
}