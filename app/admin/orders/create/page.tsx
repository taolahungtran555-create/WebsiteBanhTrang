import { prisma } from '@/lib/prisma';
import OrderForm from '../OrderForm';

export const dynamic = 'force-dynamic';

export default async function CreateOrderPage() {
  const products = await prisma.menuItem.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: { name: 'asc' },
  });

  return <OrderForm products={products} />;
}
