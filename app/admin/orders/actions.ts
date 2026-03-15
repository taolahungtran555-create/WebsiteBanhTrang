'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: any) {
  const { customerName, customerPhone, customerAddress, status, note, items } = formData;

  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  const order = await prisma.order.create({
    data: {
      customerName,
      customerPhone,
      customerAddress,
      status,
      note,
      totalAmount,
      orderItems: {
        create: items.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  revalidatePath('/admin/orders');
  return order;
}

export async function updateOrderStatus(id: number, status: string) {
  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/orders');
}

export async function updateOrder(id: number, formData: any) {
  const { customerName, customerPhone, customerAddress, status, note, items } = formData;

  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  // Delete existing items and recreate them to keep it simple for now
  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: { orderId: id },
    }),
    prisma.order.update({
      where: { id },
      data: {
        customerName,
        customerPhone,
        customerAddress,
        status,
        note,
        totalAmount,
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    }),
  ]);

  revalidatePath('/admin/orders');
}

export async function deleteOrder(id: number) {
  await prisma.order.delete({
    where: { id },
  });

  revalidatePath('/admin/orders');
}
