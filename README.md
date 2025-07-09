# Orange Money SDK

> **Disclaimer:** This is not an official SDK from Orange. This is a side project created to simplify Orange Money Web Payment integration. Ensure compliance with Orange Money's terms of service.

An easy-to-use SDK for integrating Orange Money Web Payment in your applications.

---

## Overview

This SDK allows you to create Orange Money payment links seamlessly by handling authentication and request signing. It requires you to provide your own Orange Money credentials and configure URLs for payment flow and notifications.

---

## Prerequisites

Before using the SDK, you must have an Orange Money developer account and obtain the following credentials from Orange Money:

- **BASIC_TOKEN**: Your OAuth basic authentication token (for the initial token request)
- **TOKEN_URL**: URL to request OAuth access token (usually `https://api.orange.com/oauth/v1/token`)
- **merchantKey**: Your merchant secret key used to sign requests
- **paymentUrl**: URL to create payment requests (usually `https://api.orange.com/orange-money-webpay/dev/v1/webpayment`)



---

## Options

| Option        | Type    | Description                                                                                      |
|---------------|---------|------------------------------------------------------------------------------------------------|
| `basicToken`  | `string`| OAuth basic token for initial authentication                                                    |
| `tokenUrl`    | `string`| URL to request OAuth access token                                                               |
| `paymentUrl`  | `string`| Orange Money API endpoint to create payment links                                               |
| `merchantKey` | `string`| Your merchant secret key used to sign payment requests                                          |
| `orderId`     | `string`| Unique identifier for each payment transaction                                                  |
| `totalPrice`  | `number`| Amount to be paid (in the smallest currency unit, e.g., cents)                                 |
| `currency`    | `string`| Currency code for the payment (e.g., 'XOF', 'USD', 'EUR'). Defaults to 'XOF' if not provided |
| `returnUrl`   | `string`| URL where customers are redirected after a successful payment                                   |
| `cancelUrl`   | `string`| URL where customers are redirected after cancelling a payment                                   |
| `notifUrl`    | `string`| Backend URL where Orange Money sends asynchronous payment notifications       

> **Important:** The `notifUrl` is crucial for receiving asynchronous transaction results. Make sure it is publicly accessible and secured.                   |

---

## Installation

### Download the pre-built SDK

You can download the `dist/` directory from the repository and copy it directly into your project. This contains the pre-built SDK files.

Import it in your code as:

```ts
import { OrangeMoney } from './dist';
```

### Clone the full repository (for development)

```bash
git clone https://github.com/sorybarry223/timilo.git
cd timilo
npm install
npm run build
```

After building, use the `dist/` directory or link the package locally.


---

## Usage Example

```ts
import { OrangeMoney } from './dist';

const sdk = new OrangeMoney({
  basicToken: 'your_basic_token_here',
  tokenUrl: 'https://api.orange.com/oauth/v1/token',
  paymentUrl: 'https://api.orange.com/orange-money-webpay/dev/v1/webpayment',
});

async function testPayment() {
  try {
    const result = await sdk.createPaymentLink({
      merchantKey: 'your_merchant_key',
      orderId: 'ORDER_001',         // Must be unique for each transaction
      totalPrice: 1000,             // Amount in smallest currency unit
      currency: 'XOF',
      returnUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      notifUrl: 'https://example.com/notify',
    });

    console.log('✅ Payment link:', result.payment_url);
    console.log('🔔 Notification token:', result.notif_token);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPayment();
```

---

## Testing

This SDK includes a comprehensive test suite to ensure reliability and correctness. The testing architecture follows best practices with unit tests, integration tests, and proper mocking.

### Test Structure

```
tests/
├── __mocks__/
│   └── axios.ts          # Mock for HTTP requests
├── unit/
│   ├── auth.test.ts      # Authentication module tests
│   ├── payment.test.ts   # Payment module tests
│   └── types.test.ts     # Type definitions tests
├── integration/
│   └── sdk.test.ts       # End-to-end SDK tests
└── setup.ts              # Global test configuration
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Coverage

The test suite covers:

#### Unit Tests (`tests/unit/`)

- **`auth.test.ts`**: Tests the authentication module
  - ✅ Successful token retrieval
  - ✅ Error handling for invalid responses
  - ✅ Network error handling
  - ✅ Empty response handling

- **`payment.test.ts`**: Tests the payment link generation
  - ✅ Successful payment link creation
  - ✅ Default currency handling
  - ✅ Error handling for missing response fields
  - ✅ Network error handling
  - ✅ Invalid response handling

- **`types.test.ts`**: Tests TypeScript type definitions
  - ✅ Type structure validation
  - ✅ Optional field handling
  - ✅ Type compatibility checks

#### Integration Tests (`tests/integration/`)

- **`sdk.test.ts`**: Tests the complete SDK flow
  - ✅ SDK instantiation
  - ✅ Complete payment flow (token → payment link)
  - ✅ Error propagation
  - ✅ Real-world data scenarios

### Test Configuration

The project uses Jest with TypeScript support:

- **Jest Configuration**: `jest.config.js`
- **TypeScript Support**: `ts-jest` preset
- **Mocking**: Axios HTTP requests are mocked
- **Coverage**: Reports coverage for all source files

### Adding New Tests

When adding new functionality:

1. **Unit Tests**: Add tests in `tests/unit/` for individual modules
2. **Integration Tests**: Add tests in `tests/integration/` for complete flows
3. **Mocks**: Update `tests/__mocks__/` if new dependencies need mocking
4. **Types**: Add type tests in `tests/unit/types.test.ts` for new interfaces

### Example Test Pattern

```ts
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Your Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle success case', async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await yourFunction();

    // Assert
    expect(result).toBeDefined();
    expect(mockedAxios.post).toHaveBeenCalledWith(/* expected args */);
  });
});
```

---

## Important Notes

- **Unique orderId**: Each transaction must have a unique `orderId`. Reusing it results in errors such as HTTP 403 Forbidden.

- **Notification URL (notifUrl)**: This URL must be publicly accessible for Orange Money to send payment status notifications.

- **Keep credentials secure**: Never expose your `merchantKey`, `basicToken`, or other sensitive information in public repositories.

- **Token Management**: The SDK handles OAuth token requests and refreshes automatically. Ensure the tokens and URLs remain valid.

- **Error Handling**: Always handle errors gracefully when calling SDK methods.

---

## Support

If you encounter issues or have questions, please open an issue on the GitHub repository or contact your Orange Money account manager.

## License

MIT License © 2025 Sory BARRY
