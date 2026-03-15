'use client';

import { Trash2 } from 'lucide-react';
import { deleteOrder } from './actions';
import { useState } from 'react';

export default function OrderDeleteButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setIsDeleting(true);
      try {
        await deleteOrder(id);
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa đơn hàng');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-600 hover:text-red-900 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Xóa"
    >
      <Trash2 size={20} />
    </button>
  );
}
