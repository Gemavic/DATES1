// AI Agent Assistant for Dates Platform Support
export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: 'general' | 'technical' | 'billing' | 'account' | 'safety' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  responderId: string;
  responderName: string;
  message: string;
  timestamp: Date;
  isStaff: boolean;
}

export interface AIResponse {
  id: string;
  query: string;
  response: string;
  confidence: number;
  category: string;
  suggestedActions: string[];
  timestamp: Date;
}

class AIAgentAssistant {
  private tickets: Map<string, SupportTicket> = new Map();
  private knowledgeBase: Map<string, string> = new Map();
  
  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase(): void {
    this.knowledgeBase.set('credits', 'Our credit system works like this:\n\n💳 Credits are used for premium features:\n• Live Chat: 2 credits/minute or 1 kobo/minute\n• Send Photos: 10 credits\n• Video Calls: 60 credits/minute\n• Audio Calls: 50 credits/minute\n• Mail: 10-30 credits\n• Virtual Gifts: varies\n\n💖 Kobos are priority chat credits (1 kobo = 1 minute)\n\n🎁 New users get 10 complimentary credits + 10 kobos!');
    
    this.knowledgeBase.set('payment', 'We accept multiple payment methods:\n\n💳 Credit/Debit Cards (Visa, MasterCard, Amex)\n₿ Cryptocurrencies:\n  • Bitcoin (3 confirmations)\n  • Ethereum (12 confirmations)\n  • USDT, USDC, BNB, ADA, SOL, MATIC, LTC, DOGE\n📱 Mobile Payments (Apple Pay, Google Pay, Samsung Pay)\n💙 PayPal: histogm@gmail.com\n\n🔒 All payments secured with 256-bit SSL encryption\n📤 Upload payment proof for crypto payments\n⏱️ Crypto processing: 2-30 minutes');
    
    this.knowledgeBase.set('contact', 'Contact Dates.care:\n\n📧 Email Support:\n• General: info@dates.care\n• Support: supports@dates.care\n• Technical: tech@dates.care\n• Billing: billing@dates.care\n• Safety: safety@dates.care\n• Admin: admin@dates.care\n• Verification: verification@dates.care\n\n📞 Phone: +1 (424) 488-7950\n📍 Address: 5515 Eglinton Ave, Etobicoke, ON, Canada\n\n⏰ Available 24/7 for urgent matters!\n🎫 Create support ticket for detailed assistance\n📊 Average response time: 2-4 hours');
    
    this.knowledgeBase.set('technical', 'I can help with technical issues:\n\n🔧 Common solutions:\n• Clear browser cache and cookies\n• Try a different browser (Chrome, Firefox, Safari)\n• Check internet connection\n• Update your browser to latest version\n• Disable browser extensions\n• Check camera/microphone permissions for calls\n\n📧 For complex issues: tech@dates.care\n📞 Urgent technical support: +1 (424) 488-7950');
  }

  // Create support ticket
  createSupportTicket(
    userId: string,
    userEmail: string,
    userName: string,
    category: SupportTicket['category'],
    subject: string,
    description: string
  ): string {
    const ticketId = 'TK-' + Math.random().toString(36).substring(2).toUpperCase();
    
    const priority = this.determinePriority(category, description);
    
    const ticket: SupportTicket = {
      id: ticketId,
      userId,
      userEmail,
      userName,
      category,
      priority,
      subject,
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    };

    this.tickets.set(ticketId, ticket);
    
    console.log(`Support ticket created: ${ticketId}`);
    return ticketId;
  }

  // Determine ticket priority
  private determinePriority(category: string, description: string): SupportTicket['priority'] {
    if (category === 'urgent') return 'urgent';
    if (category === 'billing' || category === 'safety') return 'high';
    if (category === 'technical') return 'medium';
    return 'low';
  }

  // Get AI response
  getAIResponse(query: string): AIResponse {
    const queryLower = query.toLowerCase();
    let response = '';
    let confidence = 0;
    let category = 'general';
    let suggestedActions: string[] = [];
    
    if (queryLower.includes('credit') || queryLower.includes('kobo')) {
      response = this.knowledgeBase.get('credits') || '';
      confidence = 0.9;
      category = 'credits';
      suggestedActions = ['Buy more credits', 'View pricing', 'Contact billing'];
    } else if (queryLower.includes('pay') || queryLower.includes('billing')) {
      response = this.knowledgeBase.get('payment') || '';
      confidence = 0.9;
      category = 'payment';
      suggestedActions = ['Payment methods', 'Crypto wallets', 'Contact billing'];
    } else if (queryLower.includes('contact') || queryLower.includes('support')) {
      response = this.knowledgeBase.get('contact') || '';
      confidence = 0.9;
      category = 'contact';
      suggestedActions = ['Call support', 'Email support', 'Create ticket'];
    } else if (queryLower.includes('technical') || queryLower.includes('bug')) {
      response = this.knowledgeBase.get('technical') || '';
      confidence = 0.9;
      category = 'technical';
      suggestedActions = ['Clear cache', 'Try different browser', 'Contact tech support'];
    } else {
      response = 'I can help you with questions about credits, payments, technical issues, and general support. What would you like to know?';
      confidence = 0.5;
      suggestedActions = ['Credits & Pricing', 'Payment Methods', 'Technical Support', 'Contact Support'];
    }
    
    return {
      id: Math.random().toString(36).substring(2),
      query,
      response,
      confidence,
      category,
      suggestedActions,
      timestamp: new Date()
    };
  }
}

// Create singleton instance
export const agentAssistant = new AIAgentAssistant();

// Export utility functions
export const getAIResponse = (query: string): AIResponse => {
  return agentAssistant.getAIResponse(query);
};

export const createSupportTicket = (
  userId: string,
  userEmail: string,
  userName: string,
  category: SupportTicket['category'],
  subject: string,
  description: string
): string => {
  return agentAssistant.createSupportTicket(userId, userEmail, userName, category, subject, description);
};

  // Request credit access for staff
  requestCreditAccess(staffId: string, targetUserId: string, reason: string): string {
    if (!this.isStaffMember(staffId)) {
      throw new Error('Only staff members can request credit access');
    }

    const requestId = Math.random().toString(36).substring(2);
    this.creditAccessRequests.set(requestId, {
      staffId,
      targetUserId,
      reason,
      timestamp: new Date(),
      status: 'pending'
    });

    return requestId;
  }

  // Approve credit access request
  approveCreditAccess(requestId: string, creditManagerId: string): boolean {
    if (!this.isCreditManager(creditManagerId)) {
      throw new Error('Only Credit Managers can approve credit access');
    }

    const request = this.creditAccessRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    request.status = 'approved';
    request.approvedBy = creditManagerId;
    return true;
  }

  // Check if staff has approved access to user credits
  hasApprovedCreditAccess(staffId: string, targetUserId: string): boolean {
    if (this.isCreditManager(staffId)) {
      return true; // Credit managers have automatic access
    }

    for (const [_, request] of this.creditAccessRequests) {
      if (request.staffId === staffId && 
          request.targetUserId === targetUserId && 
          request.status === 'approved') {
        return true;
      }
    }
    return false;
  }

  // Get user data for staff (with approval check)
  getStaffUserData(staffId: string, targetUserId: string): {
    complimentaryCredits: number;
    purchasedCredits: number;
    totalCredits: number;
    kobos: number;
    transactions: CreditTransaction[];
    accessApproved: boolean;
  } {
    if (!this.isStaffMember(staffId)) {
      throw new Error('Access denied: Not a staff member');
    }

    const hasAccess = this.hasApprovedCreditAccess(staffId, targetUserId);
    if (!hasAccess) {
      return {
        complimentaryCredits: 0,
        purchasedCredits: 0,
        totalCredits: 0,
        kobos: 0,
        transactions: [],
        accessApproved: false
      };
    }

    this.initializeUser(targetUserId);
    const user = this.users.get(targetUserId)!;
    
    return {
      complimentaryCredits: user.complimentaryCredits,
      purchasedCredits: user.purchasedCredits,
      totalCredits: user.complimentaryCredits + user.purchasedCredits,
      kobos: this.getKobos(targetUserId),
      transactions: user.transactions,
      accessApproved: true
    };
  }

  // Get pending credit access requests for managers
  getPendingCreditRequests(): Array<{
    requestId: string;
    staffId: string;
    targetUserId: string;
    reason: string;
    timestamp: Date;
  }> {
    const pending = [];
    for (const [requestId, request] of this.creditAccessRequests) {
      if (request.status === 'pending') {
        pending.push({
          requestId,
          staffId: request.staffId,
          targetUserId: request.targetUserId,
          reason: request.reason,
          timestamp: request.timestamp
        });
      }
    }
    return pending;
  }

  // Get total available credits
  getTotalCredits(userId: string): number {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    return user.complimentaryCredits + user.purchasedCredits;
  }

  // Generate kobos
  private generateKobos(count: number): ChatKobo[] {
    const kobos: ChatKobo[] = [];
    for (let i = 0; i < count; i++) {
      kobos.push({
        id: Math.random().toString(36).substring(2),
        value: 1,
        purchaseDate: new Date(),
        used: false
      });
    }
    return kobos;
  }

  // Get kobos count
  getKobos(userId: string): number {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    return user.kobos.filter(kobo => !kobo.used).length;
  }

  // Mail functionality with La-Date pricing
  canSendMail(userId: string, threadId: string): { canSend: boolean; cost: number; isFree: boolean } {
    const user = this.users.get(userId);
    if (this.isStaffMember(userId)) return { canSend: true, cost: 0, isFree: true };
    if (!user) return { canSend: false, cost: 10, isFree: false };

    const threadData = user.mailThreads.get(threadId);
    const isFirstMail = !threadData || !threadData.firstMailSent;

    if (isFirstMail) {
      return { canSend: true, cost: this.pricing.mail.firstLetterCost, isFree: false };
    }

    const cost = this.pricing.mail.followingLetterCost;
    const totalCredits = this.getTotalCredits(userId);

    return {
      canSend: totalCredits >= cost,
      cost: cost,
      isFree: false
    };
  }

  // Read mail functionality
  canReadMail(userId: string, threadId: string): { canRead: boolean; cost: number; isFree: boolean } {
    const user = this.users.get(userId);
    if (this.isStaffMember(userId)) return { canRead: true, cost: 0, isFree: true };
    if (!user) return { canRead: false, cost: 10, isFree: false };

    const threadData = user.mailThreads.get(threadId);
    const isFirstRead = !threadData || !threadData.firstMailRead;

    if (isFirstRead) {
      return { canRead: true, cost: 0, isFree: true }; // First letter to read is free
    }

    const cost = this.pricing.mail.followingLetterReadCost;
    const totalCredits = this.getTotalCredits(userId);

    return {
      canRead: totalCredits >= cost,
      cost: cost,
      isFree: false
    };
  }

  // Photo functionality with La-Date pricing
  canSendPhoto(userId: string, threadId: string, isInMail: boolean = false): { canSend: boolean; cost: number; isFree: boolean } {
    const user = this.users.get(userId);
    if (this.isStaffMember(userId)) return { canSend: true, cost: 0, isFree: true };
    if (!user) return { canSend: false, cost: 10, isFree: false };

    if (isInMail) {
      return { canSend: true, cost: 0, isFree: true }; // Sending photos in mail is free
    }

    const cost = this.pricing.chat.sendingPhotos;
    const totalCredits = this.getTotalCredits(userId);

    return {
      canSend: totalCredits >= cost,
      cost: cost,
      isFree: false
    };
  }

  // View photo functionality
  canViewPhoto(userId: string, threadId: string, isInMail: boolean = false): { canView: boolean; cost: number; isFree: boolean } {
    const user = this.users.get(userId);
    if (this.isStaffMember(userId)) return { canView: true, cost: 0, isFree: true };
    if (!user) return { canView: false, cost: 10, isFree: false };

    if (isInMail) {
      const threadData = user.mailThreads.get(threadId);
      const isFirstPhoto = !threadData || !threadData.firstPhotoViewed;
      
      if (isFirstPhoto) {
        return { canView: true, cost: 0, isFree: true }; // First photo in thread is free
      }
      
      const cost = this.pricing.mail.followingPhotoCost;
      const totalCredits = this.getTotalCredits(userId);
      
      return {
        canView: totalCredits >= cost,
        cost: cost,
        isFree: false
      };
    }

    const cost = this.pricing.media.photoViewing;
    const totalCredits = this.getTotalCredits(userId);

    return {
      canView: totalCredits >= cost,
      cost: cost,
      isFree: false
    };
  }

  // Get credit packages with modern pricing
  getCreditPackages(): CreditPackage[] {
    return [
      {
        id: 'starter',
        name: 'Starter Pack',
        credits: 50,
        price: 9.99,
        bonus: 10,
        type: 'credits',
        features: ['50 Credits', '10 Bonus Credits', 'Chat & Mail Access', 'Photo Sharing']
      },
      {
        id: 'popular',
        name: 'Popular Pack',
        credits: 150,
        price: 24.99,
        originalPrice: 34.99,
        discount: 29,
        bonus: 50,
        popular: true,
        savings: 'Save $10',
        type: 'credits',
        features: ['150 Credits', '50 Bonus Credits', 'Priority Support', 'Advanced Features', 'Video Access']
      },
      {
        id: 'premium',
        name: 'Premium Pack',
        credits: 300,
        price: 44.99,
        originalPrice: 64.99,
        discount: 31,
        bonus: 100,
        savings: 'Save $20',
        type: 'credits',
        features: ['300 Credits', '100 Bonus Credits', 'VIP Status', 'Exclusive Features', 'Unlimited Photos']
      },
      {
        id: 'kobos-small',
        name: 'Chat Kobos - Small',
        credits: 30,
        price: 14.99,
        type: 'kobos',
        features: ['30 Chat Kobos', '30 Minutes of Chat', 'Premium Chat Features', 'Sticker Access']
      },
      {
        id: 'kobos-large',
        name: 'Chat Kobos - Large',
        credits: 100,
        price: 39.99,
        bonus: 20,
        type: 'kobos',
        features: ['100 Chat Kobos', '20 Bonus Kobos', '120 Minutes of Chat', 'VIP Chat Status', 'Priority Matching']
      },
      {
        id: 'ultimate',
        name: 'Ultimate Combo',
        credits: 500,
        price: 79.99,
        originalPrice: 119.99,
        discount: 33,
        bonus: 200,
        savings: 'Save $40',
        type: 'combo',
        features: ['500 Credits', '200 Bonus Credits', '50 Chat Kobos', 'All Premium Features', 'Priority Support', 'VIP Status']
      }
    ];
  }

  // Get spending options with La-Date pricing
  getSpendingOptions() {
    return [
      { id: 'live_chat', name: 'Live Chat', cost: 2, description: '2 credits or 1 kobo per minute' },
      { id: 'send_blink', name: 'Send Blink', cost: 1, description: 'Quick way to show interest' },
      { id: 'send_message', name: 'Send Message', cost: 5, description: 'Send a personal message' },
      { id: 'chat_stickers', name: 'Chat Stickers', cost: 5, description: 'Express yourself with stickers' },
      { id: 'send_photo_chat', name: 'Send Photo (Chat)', cost: 10, description: 'Share photos in chat' },
      { id: 'open_audio_chat', name: 'Open Audio (Chat)', cost: 10, description: 'Listen to voice messages' },
      { id: 'open_video_chat', name: 'Open Video (Chat)', cost: 50, description: 'Watch video messages' },
      { id: 'exclusive_post', name: 'Exclusive Post', cost: 50, description: 'Access exclusive content' },
      { id: 'video_call', name: 'Video Call', cost: 60, description: 'Per minute video calling' },
      { id: 'audio_call', name: 'Audio Call', cost: 50, description: 'Per minute audio calling' },
      { id: 'video_message', name: 'Video Message', cost: 50, description: 'Send video messages' },
      { id: 'audio_message', name: 'Audio Message', cost: 30, description: 'Send audio messages' },
      { id: 'send_first_mail', name: 'Send First Mail', cost: 10, description: 'First letter in thread' },
      { id: 'send_following_mail', name: 'Send Following Mail', cost: 30, description: 'Additional letters' },
      { id: 'read_first_mail', name: 'Read First Mail', cost: 0, description: 'First letter is free' },
      { id: 'read_following_mail', name: 'Read Following Mail', cost: 10, description: 'Additional letters' },
      { id: 'send_blink', name: 'Send Blink', cost: 1, description: 'Quick way to show interest' },
      { id: 'send_photo_mail', name: 'Send Photo (Mail)', cost: 0, description: 'Free of charge' },
      { id: 'view_first_photo_mail', name: 'View First Photo (Mail)', cost: 0, description: 'First photo is free' },
      { id: 'view_following_photo_mail', name: 'View Following Photo (Mail)', cost: 10, description: 'Additional photos' },
      { id: 'open_video_mail', name: 'Open Video (Mail)', cost: 50, description: 'Per video' },
      { id: 'profile_videos', name: 'Profile Videos', cost: 50, description: 'View profile videos' },
      { id: 'virtual_gifts', name: 'Virtual Gifts', cost: 'varies', description: 'See gift catalog' },
      { id: 'presents', name: 'Presents', cost: 'varies', description: 'See presents catalog' }
    ];
  }

  // Get gift catalog
  getGiftCatalog(): GiftItem[] {
    return [
      // Romantic Gifts
      { id: 'red_rose', name: 'Red Rose', emoji: '🌹', price: 5, category: 'romantic', description: 'Classic symbol of love', popularity: 95 },
      { id: 'bouquet', name: 'Rose Bouquet', emoji: '💐', price: 15, category: 'romantic', description: 'Beautiful flower arrangement', popularity: 88 },
      { id: 'love_heart', name: 'Love Heart', emoji: '💖', price: 3, category: 'romantic', description: 'Express your feelings', popularity: 92 },
      { id: 'love_letter', name: 'Love Letter', emoji: '💌', price: 8, category: 'romantic', description: 'Romantic message', popularity: 85 },
      { id: 'kiss', name: 'Kiss', emoji: '💋', price: 2, category: 'romantic', description: 'Sweet kiss', popularity: 90 },
      { id: 'promise_ring', name: 'Promise Ring', emoji: '💍', price: 25, category: 'romantic', description: 'Symbol of commitment', popularity: 78 },
      { id: 'chocolate_box', name: 'Chocolate Box', emoji: '🍫', price: 12, category: 'romantic', description: 'Sweet treats', popularity: 87 },
      { id: 'romantic_candle', name: 'Romantic Candle', emoji: '🕯️', price: 7, category: 'romantic', description: 'Set the mood', popularity: 82 },
      { id: 'champagne_romantic', name: 'Champagne & Roses', emoji: '🥂', price: 35, category: 'romantic', description: 'Celebrate your love', popularity: 89 },
      { id: 'love_poem', name: 'Love Poem', emoji: '📜', price: 6, category: 'romantic', description: 'Heartfelt poetry', popularity: 84 },
      { id: 'romantic_dinner', name: 'Romantic Dinner', emoji: '🍽️', price: 45, category: 'romantic', description: 'Candlelit dinner for two', popularity: 91 },
      { id: 'love_song', name: 'Love Song', emoji: '🎵', price: 18, category: 'romantic', description: 'Personalized love song', popularity: 86 },
      { id: 'sunset_date', name: 'Sunset Date', emoji: '🌅', price: 30, category: 'romantic', description: 'Romantic sunset experience', popularity: 88 },
      
      // Luxury Gifts
      { id: 'diamond', name: 'Diamond', emoji: '💎', price: 100, category: 'luxury', description: 'Ultimate luxury gift', popularity: 95 },
      { id: 'emerald', name: 'Emerald', emoji: '💚', price: 80, category: 'luxury', description: 'Precious green gem', popularity: 75 },
      { id: 'sapphire', name: 'Sapphire', emoji: '💙', price: 85, category: 'luxury', description: 'Royal blue gem', popularity: 78 },
      { id: 'crown', name: 'Crown', emoji: '👑', price: 50, category: 'luxury', description: 'Treat them like royalty', popularity: 88 },
      { id: 'champagne', name: 'Champagne', emoji: '🍾', price: 35, category: 'luxury', description: 'Celebrate in style', popularity: 85 },
      { id: 'luxury_watch', name: 'Luxury Watch', emoji: '⌚', price: 75, category: 'luxury', description: 'Timeless elegance', popularity: 72 },
      { id: 'sports_car', name: 'Sports Car', emoji: '🏎️', price: 200, category: 'luxury', description: 'Ultimate dream gift', popularity: 90 },
      { id: 'yacht', name: 'Luxury Yacht', emoji: '🛥️', price: 300, category: 'luxury', description: 'Sail away together', popularity: 85 },
      { id: 'private_jet', name: 'Private Jet', emoji: '✈️', price: 500, category: 'luxury', description: 'Fly in style', popularity: 92 },
      { id: 'mansion', name: 'Dream Mansion', emoji: '🏰', price: 1000, category: 'luxury', description: 'Live like royalty', popularity: 88 },
      { id: 'golden_necklace', name: 'Golden Necklace', emoji: '📿', price: 120, category: 'luxury', description: 'Elegant gold jewelry', popularity: 83 },
      { id: 'designer_bag', name: 'Designer Bag', emoji: '👜', price: 150, category: 'luxury', description: 'Luxury fashion accessory', popularity: 79 },
      { id: 'spa_weekend', name: 'Spa Weekend', emoji: '🧖‍♀️', price: 180, category: 'luxury', description: 'Relaxing spa getaway', popularity: 87 },
      
      // Fun & Cute Gifts
      { id: 'teddy_bear', name: 'Teddy Bear', emoji: '🧸', price: 8, category: 'fun', description: 'Cuddly companion', popularity: 92 },
      { id: 'cute_puppy', name: 'Cute Puppy', emoji: '🐶', price: 12, category: 'fun', description: 'Adorable furry friend', popularity: 95 },
      { id: 'kitten', name: 'Adorable Kitten', emoji: '🐱', price: 12, category: 'fun', description: 'Sweet little cat', popularity: 94 },
      { id: 'birthday_cake', name: 'Birthday Cake', emoji: '🎂', price: 10, category: 'fun', description: 'Celebrate special moments', popularity: 88 },
      { id: 'cupcake', name: 'Cupcake', emoji: '🧁', price: 4, category: 'fun', description: 'Sweet little treat', popularity: 85 },
      { id: 'balloons', name: 'Balloons', emoji: '🎈', price: 6, category: 'fun', description: 'Party atmosphere', popularity: 80 },
      { id: 'unicorn', name: 'Unicorn', emoji: '🦄', price: 18, category: 'fun', description: 'Magical creature', popularity: 87 },
      { id: 'rainbow', name: 'Rainbow', emoji: '🌈', price: 8, category: 'fun', description: 'Colorful happiness', popularity: 83 },
      { id: 'panda', name: 'Cute Panda', emoji: '🐼', price: 14, category: 'fun', description: 'Adorable bamboo lover', popularity: 91 },
      { id: 'butterfly', name: 'Butterfly', emoji: '🦋', price: 5, category: 'fun', description: 'Beautiful transformation', popularity: 86 },
      { id: 'shooting_star', name: 'Shooting Star', emoji: '🌠', price: 9, category: 'fun', description: 'Make a wish', popularity: 89 },
      { id: 'funny_meme', name: 'Funny Meme', emoji: '😂', price: 3, category: 'fun', description: 'Share a laugh', popularity: 93 },
      { id: 'magic_wand', name: 'Magic Wand', emoji: '🪄', price: 11, category: 'fun', description: 'Make magic happen', popularity: 84 },
      { id: 'party_hat', name: 'Party Hat', emoji: '🎉', price: 5, category: 'fun', description: 'Celebration time', popularity: 82 },
      
      // Casual Gifts
      { id: 'coffee', name: 'Coffee', emoji: '☕', price: 3, category: 'casual', description: 'Morning energy boost', popularity: 90 },
      { id: 'pizza_slice', name: 'Pizza Slice', emoji: '🍕', price: 5, category: 'casual', description: 'Delicious comfort food', popularity: 92 },
      { id: 'burger', name: 'Gourmet Burger', emoji: '🍔', price: 7, category: 'casual', description: 'Tasty meal', popularity: 88 },
      { id: 'beer', name: 'Beer', emoji: '🍺', price: 6, category: 'casual', description: 'Refreshing drink', popularity: 85 },
      { id: 'wine_glass', name: 'Wine Glass', emoji: '🍷', price: 8, category: 'casual', description: 'Elegant drink', popularity: 87 },
      { id: 'ice_cream', name: 'Ice Cream', emoji: '🍦', price: 4, category: 'casual', description: 'Cool sweet treat', popularity: 89 },
      { id: 'donut', name: 'Donut', emoji: '🍩', price: 3, category: 'casual', description: 'Sweet snack', popularity: 86 },
      { id: 'taco', name: 'Delicious Taco', emoji: '🌮', price: 4, category: 'casual', description: 'Spicy and tasty', popularity: 87 },
      { id: 'sushi', name: 'Sushi Roll', emoji: '🍣', price: 9, category: 'casual', description: 'Fresh and elegant', popularity: 85 },
      { id: 'smoothie', name: 'Fruit Smoothie', emoji: '🥤', price: 5, category: 'casual', description: 'Healthy and refreshing', popularity: 83 },
      { id: 'popcorn', name: 'Popcorn', emoji: '🍿', price: 4, category: 'casual', description: 'Movie night snack', popularity: 84 },
      { id: 'hot_chocolate', name: 'Hot Chocolate', emoji: '☕', price: 6, category: 'casual', description: 'Warm and cozy', popularity: 88 },
      { id: 'sandwich', name: 'Sandwich', emoji: '🥪', price: 5, category: 'casual', description: 'Quick and tasty', popularity: 81 },
      
      // Seasonal Gifts
      { id: 'christmas_tree', name: 'Christmas Tree', emoji: '🎄', price: 15, category: 'seasonal', description: 'Holiday spirit', popularity: 85 },
      { id: 'valentine_card', name: 'Valentine Card', emoji: '💝', price: 6, category: 'seasonal', description: 'Love day special', popularity: 90 },
      { id: 'easter_egg', name: 'Easter Egg', emoji: '🥚', price: 5, category: 'seasonal', description: 'Spring celebration', popularity: 75 },
      { id: 'halloween_pumpkin', name: 'Halloween Pumpkin', emoji: '🎃', price: 8, category: 'seasonal', description: 'Spooky fun', popularity: 80 },
      { id: 'fireworks', name: 'Fireworks', emoji: '🎆', price: 12, category: 'seasonal', description: 'Celebration spectacular', popularity: 88 },
      { id: 'snowman', name: 'Snowman', emoji: '⛄', price: 10, category: 'seasonal', description: 'Winter fun', popularity: 82 },
      { id: 'beach_umbrella', name: 'Beach Umbrella', emoji: '🏖️', price: 11, category: 'seasonal', description: 'Summer vibes', popularity: 84 },
      { id: 'autumn_leaves', name: 'Autumn Leaves', emoji: '🍂', price: 7, category: 'seasonal', description: 'Fall beauty', popularity: 81 },
      { id: 'new_year_party', name: 'New Year Party', emoji: '🎊', price: 13, category: 'seasonal', description: 'Celebrate new beginnings', popularity: 86 },
      { id: 'mothers_day', name: "Mother's Day Flowers", emoji: '🌺', price: 16, category: 'seasonal', description: 'Honor special mothers', popularity: 89 },
      { id: 'fathers_day', name: "Father's Day Gift", emoji: '👔', price: 14, category: 'seasonal', description: 'Appreciate fathers', popularity: 85 },
      { id: 'graduation_cap', name: 'Graduation Cap', emoji: '🎓', price: 12, category: 'seasonal', description: 'Celebrate achievements', popularity: 83 }
    ];
  }

  // Get pricing structure
  getPricingStructure(): PricingStructure {
    return this.pricing;
  }

  // Add credits (complimentary or purchased)
  addCredits(userId: string, amount: number, description: string, isPurchased: boolean = false): boolean {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    if (isPurchased) {
      user.purchasedCredits += amount;
    } else {
      user.complimentaryCredits += amount;
    }

    this.addTransaction(userId, {
      type: 'earn',
      amount,
      description,
      timestamp: new Date(),
      category: isPurchased ? 'premium' : 'premium'
    });
    return true;
  }

  // Spend credits (purchased first, then complimentary)
  spendCredits(userId: string, amount: number, description: string): boolean {
    this.initializeUser(userId);
    
    if (this.isStaffMember(userId)) {
      this.addTransaction(userId, {
        type: 'spend',
        amount,
        description: `${description} (Staff - Free)`,
        timestamp: new Date(),
        category: 'premium'
      });
      return true;
    }

    const user = this.users.get(userId)!;
    const totalCredits = user.complimentaryCredits + user.purchasedCredits;

    if (totalCredits >= amount) {
      // Spend purchased credits first
      if (user.purchasedCredits >= amount) {
        user.purchasedCredits -= amount;
      } else {
        const remainingAmount = amount - user.purchasedCredits;
        user.purchasedCredits = 0;
        user.complimentaryCredits -= remainingAmount;
      }

      this.addTransaction(userId, {
        type: 'spend',
        amount,
        description,
        timestamp: new Date(),
        category: 'premium'
      });
      return true;
    }
    return false;
  }

  // Get user statistics
  getUserStats(userId: string) {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    const totalEarned = user.transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSpent = user.transactions
      .filter(t => t.type === 'spend')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalEarned,
      totalSpent,
      transactionCount: user.transactions.length,
      currentBalance: user.complimentaryCredits + user.purchasedCredits,
      chatKobos: this.getKobos(userId)
    };
  }

  // Get balance
  getBalance(userId: string): number {
    return this.getTotalCredits(userId);
  }

  // Can afford check
  canAfford(userId: string, amount: number): boolean {
    if (this.isStaffMember(userId)) return true;
    return this.getTotalCredits(userId) >= amount;
  }

  // Mark first mail as read in thread
  markFirstMailRead(userId: string, threadId: string): void {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    if (!user.mailThreads.has(threadId)) {
      user.mailThreads.set(threadId, {
        firstMailSent: false,
        firstMailRead: false,
        firstPhotoSent: false,
        firstPhotoViewed: false
      });
    }
    
    const threadData = user.mailThreads.get(threadId)!;
    threadData.firstMailRead = true;
  }

  // Mark first mail as sent in thread
  markFirstMailSent(userId: string, threadId: string): void {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    if (!user.mailThreads.has(threadId)) {
      user.mailThreads.set(threadId, {
        firstMailSent: false,
        firstMailRead: false,
        firstPhotoSent: false,
        firstPhotoViewed: false
      });
    }
    
    const threadData = user.mailThreads.get(threadId)!;
    threadData.firstMailSent = true;
  }

  // Check if user can send attachment for free
  canSendAttachmentFree(userId: string, threadId: string = 'default'): boolean {
    return this.isStaffMember(userId); // Only staff get free attachments
  }

  // Claim daily bonus
  claimDailyBonus(userId: string): boolean {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.dailyBonusLastClaimed) {
      const lastClaimed = new Date(user.dailyBonusLastClaimed);
      lastClaimed.setHours(0, 0, 0, 0);
      
      if (lastClaimed.getTime() === today.getTime()) {
        return false; // Already claimed today
      }
    }
    
    // Give random bonus between 1-3 credits
    const bonusAmount = Math.floor(Math.random() * 3) + 1;
    user.complimentaryCredits += bonusAmount;
    user.dailyBonusLastClaimed = new Date();
    
    this.addTransaction(userId, {
      type: 'earn',
      amount: bonusAmount,
      description: `Daily Bonus - ${bonusAmount} Credits`,
      timestamp: new Date(),
      category: 'premium'
    });
    
    return true;
  }

  // Private helper methods
  private addTransaction(userId: string, transaction: CreditTransaction): void {
    const user = this.users.get(userId);
    if (user) {
      user.transactions.push(transaction);
    }
  }

  // Get user data for display
  getUserData(userId: string): {
    complimentaryCredits: number;
    purchasedCredits: number;
    totalCredits: number;
    kobos: number;
    transactions: CreditTransaction[];
  } {
    this.initializeUser(userId);
    const user = this.users.get(userId)!;
    
    return {
      complimentaryCredits: user.complimentaryCredits,
      purchasedCredits: user.purchasedCredits,
      totalCredits: user.complimentaryCredits + user.purchasedCredits,
      kobos: this.getKobos(userId),
      transactions: user.transactions
    };
  }
}

// Create singleton instance
export const creditManager = new ModernCreditManager();

// Utility functions
export const formatCredits = (amount: number): string => {
  return `${amount.toLocaleString()} Credits`;
};

export const formatKobos = (amount: number): string => {
  return `${amount.toLocaleString()} Kobos 💖`;
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const calculateSavings = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};