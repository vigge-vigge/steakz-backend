// Test order creation and payment processing
import prisma from './utils/prisma';

async function testOrderCreation() {
  try {
    console.log('Testing order creation...');
    
    // Check if we have necessary data
    const branches = await prisma.branch.findMany();
    console.log('Branches found:', branches.length);
    if (branches.length > 0) {
      console.log('First branch:', branches[0]);
    }
    
    const menuItems = await prisma.menuItem.findMany();
    console.log('Menu items found:', menuItems.length);
    if (menuItems.length > 0) {
      console.log('First menu item:', menuItems[0]);
    }
    
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
    console.log('Customers found:', customers.length);
    if (customers.length > 0) {
      console.log('First customer:', customers[0]);
    }
    
    if (branches.length === 0) {
      console.log('ERROR: No branches found. Run seedRBAC.ts first.');
      return;
    }
    
    if (menuItems.length === 0) {
      console.log('ERROR: No menu items found. Run seedMenu.ts first.');
      return;
    }
    
    if (customers.length === 0) {
      console.log('ERROR: No customers found. Run seedRBAC.ts first.');
      return;
    }
    
    // Try to create a test order
    const testOrder = await prisma.order.create({
      data: {
        branchId: branches[0].id,
        customerId: customers[0].id,
        status: 'PENDING',
        totalAmount: 15.00,
        deliveryAddress: '123 Test Street',
        items: {
          create: {
            menuItemId: menuItems[0].id,
            quantity: 1,
            unitPrice: menuItems[0].price,
            subtotal: menuItems[0].price
          }
        }
      }
    });
    
    console.log('Test order created successfully:', testOrder.id);
    
    // Try to create a test payment
    const testPayment = await prisma.payment.create({
      data: {
        orderId: testOrder.id,
        amount: testOrder.totalAmount,
        method: 'CASH',
        status: 'COMPLETED'
      }
    });
    
    console.log('Test payment created successfully:', testPayment.id);
    
    // Clean up test data
    await prisma.payment.delete({ where: { id: testPayment.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: testOrder.id } });
    await prisma.order.delete({ where: { id: testOrder.id } });
    
    console.log('Test completed successfully - order/payment system is working');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderCreation();
