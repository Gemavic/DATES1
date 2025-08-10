// Crypto Wallet System for Dates Platform
export interface CryptoWalletInfo {
  symbol: string;
  name: string;
  address: string;
  network: string;
  qrCode?: string;
  minAmount: number;
  maxAmount: number;
  confirmations: number;
  processingTime: string;
}

export const DATES_CRYPTO_WALLETS: Record<string, CryptoWalletInfo> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin Mainnet',
    icon: '₿',
    color: 'text-orange-500',
    currency: 'Bitcoin',
    minAmount: 0.001,
    maxAmount: 10,
    confirmations: 3,
    processingTime: '10-60 minutes'
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
    network: 'Ethereum Mainnet',
    icon: 'Ξ',
    color: 'text-blue-500',
    currency: 'Ethereum',
    minAmount: 0.01,
    maxAmount: 50,
    confirmations: 12,
    processingTime: '5-15 minutes'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
    network: 'Ethereum (ERC-20)',
    icon: '₮',
    color: 'text-green-500',
    currency: 'Tether USD',
    minAmount: 10,
    maxAmount: 10000,
    confirmations: 12,
    processingTime: '5-15 minutes'
  }
};

export interface CryptoPayment {
  id: string;
  userId: string;
  cryptoSymbol: string;
  amount: number;
  usdAmount: number;
  walletAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

class CryptoPaymentManager {
  private payments: Map<string, CryptoPayment> = new Map();
  
  // Mock exchange rates (in a real app, fetch from API)
  private exchangeRates: Record<string, number> = {
    BTC: 45000,
    ETH: 2800,
    USDT: 1.00
  };

  getExchangeRate(cryptoSymbol: string): number {
    return this.exchangeRates[cryptoSymbol] || 0;
  }

  calculateCryptoAmount(usdAmount: number, cryptoSymbol: string): number {
    const rate = this.getExchangeRate(cryptoSymbol);
    if (rate === 0) return 0;
    return Number((usdAmount / rate).toFixed(8));
  }

  createPayment(userId: string, usdAmount: number, cryptoSymbol: string): CryptoPayment {
    const payment: CryptoPayment = {
      id: Math.random().toString(36).substring(2),
      userId,
      cryptoSymbol,
      amount: this.calculateCryptoAmount(usdAmount, cryptoSymbol),
      usdAmount,
      walletAddress: DATES_CRYPTO_WALLETS[cryptoSymbol]?.address || '',
      status: 'pending',
      createdAt: new Date()
    };

    this.payments.set(payment.id, payment);
    return payment;
  }

  simulateConfirmation(paymentId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = this.payments.get(paymentId);
        if (payment) {
          payment.status = 'confirmed';
          payment.confirmedAt = new Date();
          payment.txHash = Math.random().toString(36).substring(2);
        }
        resolve(true);
      }, 3000);
    });
  }

  processPayment(amount: number, cryptoSymbol: string, walletAddress: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Processing ${amount} ${cryptoSymbol} payment to ${walletAddress}`);
        resolve(true);
      }, 2000);
    });
  }
}

// Create singleton instance
export const cryptoPaymentManager = new CryptoPaymentManager();

// Utility functions for crypto payments
export const calculateCryptoAmount = (usdAmount: number, cryptoSymbol: string): number => {
  return cryptoPaymentManager.calculateCryptoAmount(usdAmount, cryptoSymbol);
};

export const getCryptoPrice = (cryptoSymbol: string): number => {
  return cryptoPaymentManager.getExchangeRate(cryptoSymbol);
};