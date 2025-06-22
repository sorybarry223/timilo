interface OrangeMoneyConfig {
    basicToken: string;
    tokenUrl: string;
    paymentUrl: string;
}
interface GeneratePaymentLinkInput {
    merchantKey: string;
    orderId: string;
    totalPrice: number;
    returnUrl: string;
    cancelUrl: string;
    notifUrl: string;
}
interface GeneratePaymentLinkOutput {
    payment_url: string;
    notif_token: string;
}

declare class OrangeMoney {
    private basicToken;
    private tokenUrl;
    private paymentUrl;
    constructor(config: OrangeMoneyConfig);
    getToken(): Promise<string>;
    createPaymentLink(input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkOutput>;
}

export { OrangeMoney };
