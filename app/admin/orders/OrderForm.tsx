'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { createOrder, updateOrder } from './actions';

type Product = {
  id: number;
  name: string;
  price: number;
};

type OrderItem = {
  menuItemId: number;
  quantity: number;
  price: number;
  name?: string; // for display
};

type Order = {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  status: string;
  note?: string | null;
  orderItems: OrderItem[];
};

export default function OrderForm({ 
  initialData, 
  products 
}: { 
  initialData?: any; 
  products: Product[] 
}) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || '');
  const [customerAddress, setCustomerAddress] = useState(initialData?.customerAddress || '');
  const [status, setStatus] = useState(initialData?.status || 'PENDING');
  const [note, setNote] = useState(initialData?.note || '');
  
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>(
    initialData?.orderItems.map((item: any) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: item.price,
      name: item.menuItem?.name
    })) || []
  );

  const [currentProductId, setCurrentProductId] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddItem = () => {
    if (!currentProductId) return;
    
    const product = products.find(p => p.id === parseInt(currentProductId));
    if (!product) return;

    const existingItemIndex = selectedItems.findIndex(item => item.menuItemId === product.id);
    
    if (existingItemIndex > -1) {
      const newItems = [...selectedItems];
      newItems[existingItemIndex].quantity += currentQuantity;
      setSelectedItems(newItems);
    } else {
      setSelectedItems([...selectedItems, {
        menuItemId: product.id,
        name: product.name,
        price: product.price,
        quantity: currentQuantity
      }]);
    }
    
    setCurrentProductId('');
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setError('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.');
      return;
    }

    setIsLoading(true);
    setError('');

    const data = {
      customerName,
      customerPhone,
      customerAddress,
      status,
      note,
      items: selectedItems
    };

    try {
      if (isEditing && initialData?.id) {
        await updateOrder(initialData.id, data);
      } else {
        await createOrder(data);
      }
      router.push('/admin/orders');
      router.refresh();
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu đơn hàng.');
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Link href="/admin/orders" className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isEditing ? `Sửa Đơn hàng #${initialData.id}` : 'Thêm Đơn hàng Mới'}
          </h1>
        </div>

        <div className="bg-white overflow-hidden shadow sm:rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Info Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      value={customerAddress || ''}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Sản phẩm trong đơn</h3>
                
                {/* Add Item Form */}
                <div className="flex flex-wrap items-end gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn sản phẩm</label>
                    <select
                      value={currentProductId}
                      onChange={(e) => setCurrentProductId(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString('vi-VN')}₫</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(parseInt(e.target.value))}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm
                  </button>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Giá</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">SL</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tổng</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-gray-500 italic">Chưa chọn sản phẩm nào</td>
                        </tr>
                      ) : (
                        selectedItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-500">{item.price.toLocaleString('vi-VN')}₫</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Tổng cộng:</td>
                        <td className="px-4 py-3 text-right font-extrabold text-lg text-[#A60817]">{totalAmount.toLocaleString('vi-VN')}₫</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status and Note */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t pt-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Trạng thái đơn hàng</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                  <textarea
                    rows={3}
                    value={note || ''}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#FE5200] focus:border-[#FE5200] sm:text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-5 flex justify-end">
                <Link
                  href="/admin/orders"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                >
                  Huỷ
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-[#A60817] hover:bg-[#8A0613] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A60817] disabled:opacity-50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang lưu...' : 'Lưu Đơn hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
