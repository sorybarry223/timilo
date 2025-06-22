"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentLink = generatePaymentLink;
const axios_1 = __importDefault(require("axios"));
async function generatePaymentLink(accessToken, paymentUrl, input) {
    var _a, _b;
    const body = {
        merchant_key: input.merchantKey,
        currency: 'XOF',
        order_id: input.orderId,
        amount: input.totalPrice,
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
        notif_url: input.notifUrl,
        lang: 'fr',
        reference: 'MyReference',
    };
    const response = await axios_1.default.post(paymentUrl, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.payment_url) || !((_b = response.data) === null || _b === void 0 ? void 0 : _b.notif_token)) {
        throw new Error('payment_url or notif_token missing in response');
    }
    return {
        payment_url: response.data.payment_url,
        notif_token: response.data.notif_token,
    };
}
