import prisma from './utils/prisma';

async function checkData() {
  try {
    const orders = await prisma.order.findMany({ 
      include: { 
        payment: true, 
        items: { include: { menuItem: true } },
        customer: true
      } 
    });
    
    console.log('Orders found:', orders.length);
    
    orders.forEach(order => {
      console.log(`Order ${order.id}: Total $${order.totalAmount}, Payment: ${order.payment ? `$${order.payment.amount}` : 'No'}, Customer: ${order.customer?.username || 'Unknown'}`);
    });
    
    const payments = await prisma.payment.findMany();
    console.log('Total payments:', payments.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
