import { pocketBaseService } from './PocketBaseService';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // You'll need to implement this based on your email service provider
      // This is a placeholder for the actual implementation
      console.log('Sending email:', emailData);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendAbandonedCartEmail(order: any): Promise<boolean> {
    const emailData: EmailData = {
      to: order.customer_email,
      subject: 'Complete Your Purchase - Special Offer Inside!',
      html: `
        <h2>Your Cart is Waiting!</h2>
        <p>Hello,</p>
        <p>We noticed you have some items in your cart:</p>
        <ul>
          ${this.formatCartItems(order.items)}
        </ul>
        <p>Total: $${order.total}</p>
        <p>Click here to complete your purchase: <a href="${this.getRecoveryUrl(order.id)}">Complete Purchase</a></p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `
    };

    return this.sendEmail(emailData);
  }

  async sendDeliveryEmail(order: any, item: any, deliveryMessage: string): Promise<boolean> {
    const emailData: EmailData = {
      to: order.customer_email,
      subject: `Your Digital Content for ${item.title} is Ready!`,
      html: `
        <h2>Your Digital Content is Ready!</h2>
        <p>Hello,</p>
        <p>Thank you for your purchase of ${item.title}.</p>
        <p>${deliveryMessage}</p>
        <p>Order Details:</p>
        <ul>
          <li>${item.quantity}x ${item.title} - $${item.price * item.quantity}</li>
        </ul>
        <p>If you have any questions about accessing your content, please contact us.</p>
      `
    };

    return this.sendEmail(emailData);
  }

  async sendRefundConfirmation(order: any): Promise<boolean> {
    const emailData: EmailData = {
      to: order.customer_email,
      subject: 'Refund Processed for Your Order',
      html: `
        <h2>Refund Confirmation</h2>
        <p>Hello,</p>
        <p>We've processed a refund for your order #${order.order_number}.</p>
        <p>Refund Amount: $${order.total}</p>
        <p>The refund should appear in your account within 5-7 business days.</p>
        <p>If you have any questions about your refund, please contact us.</p>
      `
    };

    return this.sendEmail(emailData);
  }

  private formatCartItems(items: string | any[]): string {
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      return parsedItems
        .map((item: any) => `<li>${item.quantity}x ${item.title} - $${item.price * item.quantity}</li>`)
        .join('');
    } catch (error) {
      console.error('Error formatting cart items:', error);
      return '<li>Error displaying items</li>';
    }
  }

  private getRecoveryUrl(orderId: string): string {
    return `${window.location.origin}/cart/recover/${orderId}`;
  }
}

export const emailService = new EmailService();
