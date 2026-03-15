import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderForm from '../../OrderForm';

export const dynamic = 'force-dynamic';

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    notFound();
  }

  const [order, products] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    }),
    prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!order) {
    notFound();
  }

  return <OrderForm initialData={order} products={products} />;
}
