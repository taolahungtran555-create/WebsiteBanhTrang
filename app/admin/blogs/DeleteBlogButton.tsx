"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBlogButton({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Thao tác không thể hoàn tác.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${
        isDeleting ? "bg-red-100 text-red-400 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-100"
      }`}
    >
      <Trash2 size={16} />
      {isDeleting ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
