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

/**
 * Chuyển đổi bất kỳ định dạng tags nào từ n8n sang string[]
 * n8n có thể gửi: Array, Object với numeric keys, JSON string, hoặc chuỗi phân tách dấu phẩy
 */
function parseTags(rawTags: any): string[] {
  if (rawTags === null || rawTags === undefined) return [];

  // Case 1: Mảng JS thật sự (thường nhất khi n8n nhận Array từ JSON.parse)
  if (Array.isArray(rawTags)) {
    return rawTags
      .map((t: any) => {
        if (typeof t === 'object' && t !== null) {
          return String(t.value || t.name || t.label || Object.values(t)[0] || '').trim();
        }
        return String(t).trim();
      })
      .filter(Boolean);
  }

  // Case 2: Object với numeric keys {"0":"tag1","1":"tag2"} - n8n "Using Fields Below" body
  if (typeof rawTags === 'object') {
    return Object.values(rawTags)
      .map((t: any) => String(t).trim())
      .filter(Boolean);
  }

  // Case 3: String
  if (typeof rawTags === 'string') {
    const trimmed = rawTags.trim();
    if (!trimmed) return [];

    // Thử parse JSON nếu là JSON array string
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseTags(parsed); // recursive với kết quả đã parse
      } catch {
        // Nếu lỗi thì bóc tách thủ công
        return trimmed
          .replace(/[\[\]"']/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Chuỗi phân cách bằng dấu phẩy
    return trimmed.split(',').map((t) => t.trim()).filter(Boolean);
  }

  return [];
}

export async function POST(request: Request) {
  try {
    // Đọc raw text trước để tránh lỗi parse JSON
    const rawText = await request.text();
    console.log('[n8n API] Raw body text:', rawText.substring(0, 500));

    let body: any = {};
    try {
      body = JSON.parse(rawText);
    } catch (parseError) {
      console.error('[n8n API] JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Body không phải JSON hợp lệ.', raw: rawText.substring(0, 200) },
        { status: 400 }
      );
    }

    console.log('[n8n API] Parsed body keys:', Object.keys(body));
    console.log('[n8n API] tags raw:', JSON.stringify(body.tags));
    console.log('[n8n API] seoKeyword raw:', body.seoKeyword ?? body.seokeyword);

    // Đọc các trường - hỗ trợ cả camelCase và lowercase
    const title = body.title;
    const content = body.content;
    const excerpt = body.excerpt || '';
    const coverImage = body.coverImage || body.coverimage || '';
    const providedSlug = body.slug;
    const seoTitle = body.seoTitle || body.seotitle || null;
    const seoDescription = body.seoDescription || body.seodescription || null;
    const seoKeyword = body.seoKeyword || body.seokeyword || null;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Thiếu title hoặc content.' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);
    const tags = parseTags(body.tags);
    console.log('[n8n API] Processed tags:', tags);

    const newPost = await prisma.post.create({
      data: {
        title: String(title),
        slug: String(slug),
        excerpt: String(excerpt),
        content: String(content),
        coverImage: String(coverImage),
        tags,
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
    console.error('[n8n API] Error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug đã tồn tại. Bài viết có thể đã được tạo trước đó.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi Server.', details: error.message },
      { status: 500 }
    );
  }
}