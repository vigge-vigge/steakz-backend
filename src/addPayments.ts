import prisma from './utils/prisma';

async function addPaymentsToOrders() {
  try {
    // Get all orders without payments
    const ordersWithoutPayments = await prisma.order.findMany({
      where: {
        payment: null
      },
      include: {
        payment: true
      }
    });
    
    console.log(`Found ${ordersWithoutPayments.length} orders without payments`);
    
    // Add payments to these orders
    for (const order of ordersWithoutPayments) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          method: 'CASH', // Default to cash
          status: 'COMPLETED'
        }
      });
      console.log(`Added payment for order ${order.id}`);
    }
    
    console.log('All payments added successfully!');
    
  } catch (error) {
    console.error('Error adding payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPaymentsToOrders();
