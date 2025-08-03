// Modern Credit System for Dates Platform
export interface CreditTransaction {
  type: 'spend' | 'earn';
  amount: number;
  description: string;
  timestamp: Date;
  category: 'chat' | 'mail' | 'media' | 'gifts' | 'premium';
}

export interface ChatGem {
  id: string;
  value: number; // 1 gem = 1 minute of chat
  purchaseDate: Date;
  used: boolean;
}

export interface ChatKobo {
  id: string;
  value: number; // 1 kobo = 1 minute of chat
  purchaseDate: Date;
  used: boolean;
}

export interface UserCreditData {
  complimentaryCredits: number;
  purchasedCredits: number;
  kobos: ChatKobo[];
  transactions: CreditTransaction[];
  dailyBonusLastClaimed: Date | null;
  mailThreads: Map<string, { 
    firstMailSent: boolean; 
    firstMailRead: boolean; 
    firstPhotoSent: boolean;
    firstPhotoViewed: boolean;
  }>;
  chatThreads: Map<string, {
    firstChatFree: boolean;
    totalMinutesUsed: number;
  }>;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  savings?: string;
  type: 'credits' | 'kobos' | 'combo';
  features: string[];
  originalPrice?: number;
  discount?: number;
}

export interface GiftItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'romantic' | 'luxury' | 'fun' | 'seasonal' | 'casual';
  description: string;
  popularity: number;
}

// Exact pricing structure from La-Date
export interface PricingStructure {
  chat: {
    liveChat: { credits: number; kobos: number; perMinute: boolean };
    stickers: number;
    sendingPhotos: number;
    openingAudios: number;
    openingVideos: number;
    exclusivePost: number;
    videoCall: number;
    audioCall: number;
    videoMessage: number;
    audioMessage: number;
  };
  mail: {
    firstLetterCost: number;
    followingLetterCost: number;
    firstLetterFree: boolean; // First letter to read is free
    followingLetterReadCost: number;
    sendingPhotos: number; // Free of charge
    firstPhotoFree: boolean;
    followingPhotoCost: number;
    openingVideos: number;
  };
  media: {
    profileVideos: number;
    photoViewing: number;
  };
  gifts: {
    virtualGifts: string;
    presents: string;
  };
}

class ModernCreditManager {
  private users: Map<string, UserCreditData> = new Map();
  
  // Pricing structure for Dates platform
  private pricing: PricingStructure = {
    chat: {
      liveChat: { credits: 2, kobos: 1, perMinute: true },
      stickers: 5,
      sendingPhotos: 10,
      openingAudios: 10,
      openingVideos: 50,
      exclusivePost: 50,
      videoCall: 60,
      audioCall: 50,
      videoMessage: 50,
      audioMessage: 30
    },
    mail: {
      firstLetterCost: 10, // First letter in thread costs 10 credits
      followingLetterCost: 30, // Following letters cost 30 credits
      firstLetterFree: true, // First letter to READ is free
      followingLetterReadCost: 10, // Following letters to read cost 10 credits
      sendingPhotos: 0, // Free of charge
      firstPhotoFree: true, // First photo in thread is free
      followingPhotoCost: 10, // Following photos cost 10 credits
      openingVideos: 50 // 50 credits per video
    },
    media: {
      profileVideos: 50,
      photoViewing: 10
    },
    gifts: {
      virtualGifts: 'See gift catalog',
      presents: 'See presents catalog'
    }
  };

  // Initialize user with welcome bonus
  initializeUser(userId: string): void {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        complimentaryCredits: 10, // Welcome bonus - 10 complimentary credits
        purchasedCredits: 0,
        kobos: this.generateKobos(10), // Welcome bonus - 10 kobos
        transactions: [],
        dailyBonusLastClaimed: null,
        mailThreads: new Map(),
        chatThreads: new Map()
      });
      
      this.addTransaction(userId, {
        type: 'earn',
        amount: 10,
        description: 'New User Bonus - 10 Complimentary Credits',
        timestamp: new Date(),
        category: 'premium'
      });
      
      this.addTransaction(userId, {
        type: 'earn',
        amount: 10,
        description: 'New User Bonus - 10 Kobos for Chat',
        timestamp: new Date(),
        category: 'premium'
      });
      
      console.log(`Initialized user ${userId} with welcome bonus`);
    }
  }

  // Staff member check
  isStaffMember(userId: string): boolean {
    const staffEmails = [
      'admin@dates.care',
      'support@dates.care',
      'supports@dates.care',
      'info@dates.care',
      'tech@dates.care',
      'help@dates.care',
      'moderator@dates.care',
      'staff@dates.care',
      'manager@dates.care',
      'creditmanager@dates.care'
    ];
    return staffEmails.includes(userId.toLowerCase());
  }

  // Credit Manager check
  isCreditManager(userId: string): boolean {
    const creditManagerEmails = [
      'admin@dates.care',
      'creditmanager@dates.care',
      'manager@dates.care'
    ];
    return creditManagerEmails.includes(userId.toLowerCase());
  }

  // Staff credit access requests
  private creditAccessRequests: Map<string, {
    staffId: string;
    targetUserId: string;
    reason: string;
    timestamp: Date;
    status: 'pending' | 'approved' | 'denied';
    approvedBy?: string;
  }> = new Map();

  // Credit resettlement requests for disputed or lost credits
  private creditResettlementRequests: Map<string, {
    requestId: string;
    staffId: string;
    targetUserId: string;
    amount: number;
    reason: string;
    category: 'dispute' | 'platform_glitch' | 'technical_error' | 'billing_error' | 'other';
    timestamp: Date;
    status: 'pending' | 'approved' | 'denied';
    approvedBy?: string;
    evidence?: string;
  }> = new Map();

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