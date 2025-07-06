export interface OrangeMoneyConfig {
    basicToken: string;
    tokenUrl: string;
    paymentUrl: string;
  }
  
  export interface GeneratePaymentLinkInput {
    merchantKey: string;
    orderId: string;
    totalPrice: number;
    currency?: string;
    returnUrl: string;
    cancelUrl: string;
    notifUrl: string;
  }
  
  export interface GeneratePaymentLinkOutput {
    payment_url: string;
    notif_token: string;
  }
  