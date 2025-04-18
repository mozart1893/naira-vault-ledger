
// Currency codes supported by the system
export const CURRENCIES = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    flag: "ng",
    color: "currency-ngn"
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "us",
    color: "currency-usd"
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "gb",
    color: "currency-gbp"
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "eu",
    color: "currency-eur"
  }
};

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
  CONVERSION: "conversion"
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed"
};

// Mock exchange rates (in a real system, these would come from an API)
export const EXCHANGE_RATES = {
  NGN: { NGN: 1, USD: 0.00067, GBP: 0.00052, EUR: 0.00062 },
  USD: { NGN: 1499.5, USD: 1, GBP: 0.78, EUR: 0.93 },
  GBP: { NGN: 1920.2, USD: 1.28, GBP: 1, EUR: 1.19 },
  EUR: { NGN: 1614.45, USD: 1.08, GBP: 0.84, EUR: 1 }
};
