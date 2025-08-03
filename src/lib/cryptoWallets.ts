// Crypto Wallet Integration for Dates.care
export interface CryptoWallet {
  currency: string;
  symbol: string;
  address: string;
  network: string;
  qrCode?: string;
  icon: string;
  color: string;
  confirmations: number;
}

export interface CryptoPayment {
  id: string;
  walletAddress: string;
  currency: string;
  amount: number;
  usdAmount: number;
  txHash?: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations: number;
  requiredConfirmations: number;
  timestamp: Date;
  userId: string;
  packageId: string;
}

// Dates.care Official Crypto Wallets
export const DATES_CRYPTO_WALLETS: CryptoWallet[] = [
  {
    currency: 'Bitcoin',
    symbol: 'BTC',
    address: '3CxVEXDHuUqBcCkaqLozRqwcwArYbJC35e',
    network: 'Bitcoin Mainnet',
    icon: '₿',
    color: 'text-orange-500',
    confirmations: 3
  },
  {
    currency: 'Ethereum',
    symbol: 'ETH',
    address: '0x3bb8e1af05d9c98da7ae95b453f8b291f4e8ad7a',
    network: 'Ethereum Mainnet',
    icon: 'Ξ',
    color: 'text-blue-500',
    confirmations: 12
  },
  {
    currency: 'Tether USD',
    symbol: 'USDT',
    address: 'TYfvDaDKTWE5njgZjgsS6aGAuTg3d6VJoD',
    network: 'Ethereum (ERC-20)',
    icon: '₮',
    color: 'text-green-500',
    confirmations: 12
  },
  {
    currency: 'USD Coin',
    symbol: 'USDC',
    address: '040688d6c84935d7bbcd90458cfd3a1b9dd72a864f6c3fe91a62cc62489160a',
    network: 'Ethereum (ERC-20)',
    icon: '$',
    color: 'text-blue-600',
    confirmations: 12
  },
  {
    currency: 'Binance Coin',
    symbol: 'BNB',
    address: '0x3bb8e1af05d9c98da7ae95b453f8b291f4e8ad7a',
    network: 'Binance Smart Chain',
    icon: '◉',
    color: 'text-yellow-500',
    confirmations: 15
  },
  {
    currency: 'Cardano',
    symbol: 'ADA',
    address: '040688d6c84935d7bbcd90458cfd3a1b9dd72a864f6c3fe91a62cc62489160a',
    network: 'Cardano Mainnet',
    icon: '₳',
    color: 'text-blue-600',
    confirmations: 5
  },
  {
    currency: 'Solana',
    symbol: 'SOL',
    address: '040688d6c84935d7bbcd90458cfd3a1b9dd72a864f6c3fe91a62cc62489160a',
    network: 'Solana Mainnet',
    icon: '◎',
    color: 'text-purple-500',
    confirmations: 32
  },
  {
    currency: 'Polygon',
    symbol: 'MATIC',
    address: '0x3bb8e1af05d9c98da7ae95b453f8b291f4e8ad7a',
    network: 'Polygon Mainnet',
    icon: '⬟',
    color: 'text-purple-600',
    confirmations: 128
  },
  {
    currency: 'Litecoin',
    symbol: 'LTC',
    address: 'MWNCFUwyWRRChpLprMJ93RdKE3DZE6rfa6',
    network: 'Litecoin Mainnet',
    icon: 'Ł',
    color: 'text-gray-500',
    confirmations: 6
  },
  {
    currency: 'Dogecoin',
    symbol: 'DOGE',
    address: 'DQRzheYdzRZhfkT6kCfTvUYCBnc6okBw4W',
    network: 'Dogecoin Mainnet',
    icon: 'Ð',
    color: 'text-yellow-600',
    confirmations: 6
  },
  {
    currency: 'Cardano',
    symbol: 'ADA',
    address: 'addr1q88c74l23yxnnh36zkygwv2uhs3dn5znz4uvykwyvkxlmc70vmvmt7j524yn9d3z84u33z25k2s5w88xkhujj3vds8fq2ta442',
    network: 'Cardano Mainnet',
    icon: '₳',
    color: 'text-blue-600',
    confirmations: 5
  },
  {
    currency: 'Binance Coin',
    symbol: 'BNB',
    address: '0x3bb8e1af05d9c98da7ae95b453f8b291f4e8ad7a',
    network: 'Binance Smart Chain',
    icon: '◉',
    color: 'text-yellow-500',
    confirmations: 15
  }
];

// Company Information
export const COMPANY_INFO = {
  name: 'Dates.care',
  director: 'Support Team',
  paypalWallet: 'histogm@gmail.com',
  address: '5515 Eglinton Ave, Etobicoke, ON, Canada',
  phone: '+1 424 488 7950',
  email: 'info@dates.care'
};

class CryptoPaymentManager {
  private payments: Map<string, CryptoPayment> = new Map();
  
  // Create new crypto payment
  createPayment(userId: string, packageId: string, currency: string, amount: number, usdAmount: number): CryptoPayment {
    const payment: CryptoPayment = {
      id: this.generatePaymentId(),
      walletAddress: this.getWalletAddress(currency),
      currency,
      amount,
      usdAmount,
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: this.getRequiredConfirmations(currency),
      timestamp: new Date(),
      userId,
      packageId
    };
    
    this.payments.set(payment.id, payment);
    return payment;
  }
  
  // Get wallet address for currency
  getWalletAddress(currency: string): string {
    const wallet = DATES_CRYPTO_WALLETS.find(w => w.symbol === currency);
    return wallet?.address || '';
  }
  
  // Get required confirmations for currency
  getRequiredConfirmations(currency: string): number {
    const wallet = DATES_CRYPTO_WALLETS.find(w => w.symbol === currency);
    return wallet?.confirmations || 6;
  }
  
  // Generate unique payment ID
  private generatePaymentId(): string {
    return 'crypto_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  
  // Update payment status
  updatePayment(paymentId: string, updates: Partial<CryptoPayment>): boolean {
    const payment = this.payments.get(paymentId);
    if (payment) {
      Object.assign(payment, updates);
      return true;
    }
    return false;
  }
  
  // Get payment by ID
  getPayment(paymentId: string): CryptoPayment | undefined {
    return this.payments.get(paymentId);
  }
  
  // Get all payments for user
  getUserPayments(userId: string): CryptoPayment[] {
    return Array.from(this.payments.values()).filter(p => p.userId === userId);
  }
  
  // Simulate payment confirmation (in real app, this would be blockchain monitoring)
  simulateConfirmation(paymentId: string): void {
    const payment = this.payments.get(paymentId);
    if (payment && payment.status === 'pending') {
      payment.status = 'confirming';
      payment.txHash = this.generateTxHash();
      
      // Simulate confirmation process
      const confirmationInterval = setInterval(() => {
        payment.confirmations++;
        
        if (payment.confirmations >= payment.requiredConfirmations) {
          payment.status = 'confirmed';
          clearInterval(confirmationInterval);
          this.onPaymentConfirmed(payment);
        }
      }, 2000); // Simulate 2 seconds per confirmation
    }
  }
  
  // Generate fake transaction hash
  private generateTxHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  
  // Handle confirmed payment
  private onPaymentConfirmed(payment: CryptoPayment): void {
    console.log(`Payment confirmed: ${payment.id} - ${payment.amount} ${payment.currency}`);
    // In real app, this would trigger credit addition
  }
}

export const cryptoPaymentManager = new CryptoPaymentManager();

// Crypto price simulation (in real app, use CoinGecko API)
export const getCryptoPrice = (symbol: string): number => {
  const prices: Record<string, number> = {
    'BTC': 45000,
    'ETH': 2800,
    'USDT': 1.00,
    'USDC': 1.00,
    'BNB': 320,
    'ADA': 0.45,
    'SOL': 95,
    'MATIC': 0.85,
    'LTC': 75,
    'DOGE': 0.08
  };
  return prices[symbol] || 1;
};

// Calculate crypto amount needed for USD value
export const calculateCryptoAmount = (usdAmount: number, cryptoSymbol: string): number => {
  const price = getCryptoPrice(cryptoSymbol);
  return usdAmount / price;
};