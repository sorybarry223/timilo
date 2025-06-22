"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const axios_1 = __importDefault(require("axios"));
async function getAccessToken(tokenUrl, basicToken) {
    var _a;
    const body = new URLSearchParams({ grant_type: 'client_credentials' });
    const response = await axios_1.default.post(tokenUrl, body.toString(), {
        headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token)) {
        throw new Error('No access token found in response');
    }
    return response.data.access_token;
}
