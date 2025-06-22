import { getAccessToken } from './auth';
import { generatePaymentLink } from './payment';
import type { GeneratePaymentLinkInput, GeneratePaymentLinkOutput, OrangeMoneyConfig } from './types';

export class OrangeMoney {
  private basicToken: string;
  private tokenUrl: string;
  private paymentUrl: string;

  constructor(config: OrangeMoneyConfig) {
    this.basicToken = config.basicToken;
    this.tokenUrl = config.tokenUrl;
    this.paymentUrl = config.paymentUrl;
  }

  async getToken(): Promise<string> {
    return await getAccessToken(this.tokenUrl, this.basicToken);
  }

  async createPaymentLink(input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkOutput> {
    const token = await this.getToken();
    return await generatePaymentLink(token, this.paymentUrl, input);
  }
}
