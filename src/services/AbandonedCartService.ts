import { pocketBaseService } from './PocketBaseService';
import { emailService } from './EmailService';

class AbandonedCartService {
  private readonly ABANDONED_CART_TIMEOUT = 1000 * 60 * 30; // 30 minutes
  private readonly RECOVERY_CODE_PREFIX = 'RECOVER';

  async processAbandonedCarts(): Promise<void> {
    try {
      // Get all unprocessed abandoned carts
      const abandonedCarts = await pocketBaseService.pb
        .collection('store_orders')
        .getList(1, 50, {
          filter: 'payment_status = "abandoned" && abandoned_cart_processed = false',
        });

      for (const cart of abandonedCarts.items) {
        await this.processAbandonedCart(cart);
      }
    } catch (error) {
      console.error('Error processing abandoned carts:', error);
    }
  }

  private async processAbandonedCart(cart: any): Promise<void> {
    try {
      const recoveryCode = this.generateRecoveryCode();
      
      // Update the cart with recovery code and mark as processed
      await pocketBaseService.pb.collection('store_orders').update(cart.id, {
        recovery_coupon: recoveryCode,
        abandoned_cart_processed: true,
      });

      // Send recovery email
      await emailService.sendAbandonedCartEmail(cart, recoveryCode);
    } catch (error) {
      console.error('Error processing abandoned cart:', error);
    }
  }

  private generateRecoveryCode(): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${this.RECOVERY_CODE_PREFIX}_${randomPart}`;
  }

  async scheduleAbandonedCartCheck(): Promise<void> {
    setInterval(() => this.processAbandonedCarts(), this.ABANDONED_CART_TIMEOUT);
  }

  async validateRecoveryCode(code: string): Promise<boolean> {
    try {
      const cart = await pocketBaseService.pb
        .collection('store_orders')
        .getFirstListItem(`recovery_coupon = "${code}"`);
      
      return !!cart;
    } catch (error) {
      console.error('Error validating recovery code:', error);
      return false;
    }
  }
}

export const abandonedCartService = new AbandonedCartService();
