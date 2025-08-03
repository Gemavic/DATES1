// Advanced Agent Assistant Support System for Dates.care
export interface AgentTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: 'technical' | 'billing' | 'account' | 'safety' | 'general' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  responses: AgentResponse[];
  tags: string[];
  escalated: boolean;
  satisfactionRating?: number;
}

export interface AgentResponse {
  id: string;
  ticketId: string;
  responderId: string;
  responderType: 'user' | 'agent' | 'ai';
  message: string;
  timestamp: Date;
  attachments?: string[];
  internal: boolean; // Internal agent notes
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  status: 'online' | 'busy' | 'offline';
  currentTickets: number;
  maxTickets: number;
  responseTime: number; // Average in minutes
  satisfactionRating: number;
  languages: string[];
}

export interface KnowledgeBase {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  lastUpdated: Date;
  helpful: number;
  notHelpful: number;
}

class AgentAssistantManager {
  private tickets: Map<string, AgentTicket> = new Map();
  private agents: Map<string, SupportAgent> = new Map();
  private knowledgeBase: KnowledgeBase[] = [];
  
  constructor() {
    this.initializeAgents();
    this.initializeKnowledgeBase();
  }

  // Initialize support agents
  private initializeAgents(): void {
    const agents: SupportAgent[] = [
      {
        id: 'agent-sarah',
        name: 'Sarah Johnson',
        email: 'sarah@dates.care',
        specializations: ['billing', 'payments', 'credits'],
        status: 'online',
        currentTickets: 3,
        maxTickets: 8,
        responseTime: 5,
        satisfactionRating: 4.9,
        languages: ['English', 'French']
      },
      {
        id: 'agent-mike',
        name: 'Mike Chen',
        email: 'mike@dates.care',
        specializations: ['technical', 'account', 'verification'],
        status: 'online',
        currentTickets: 2,
        maxTickets: 6,
        responseTime: 8,
        satisfactionRating: 4.8,
        languages: ['English', 'Mandarin']
      },
      {
        id: 'agent-emma',
        name: 'Emma Rodriguez',
        email: 'emma@dates.care',
        specializations: ['safety', 'moderation', 'general'],
        status: 'online',
        currentTickets: 4,
        maxTickets: 10,
        responseTime: 3,
        satisfactionRating: 4.9,
        languages: ['English', 'Spanish']
      },
      {
        id: 'agent-david',
        name: 'David Kim',
        email: 'david@dates.care',
        specializations: ['technical', 'app_issues', 'features'],
        status: 'busy',
        currentTickets: 6,
        maxTickets: 8,
        responseTime: 12,
        satisfactionRating: 4.7,
        languages: ['English', 'Korean']
      }
    ];

    agents.forEach(agent => this.agents.set(agent.id, agent));
  }

  // Initialize comprehensive knowledge base
  private initializeKnowledgeBase(): void {
    this.knowledgeBase = [
      // Credits & Pricing
      {
        id: 'kb-credits-001',
        category: 'credits',
        question: 'How do credits work?',
        answer: 'Credits are used for all premium features on Dates.care. New users get 10 complimentary credits + 10 kobos. Live chat costs 2 credits/minute or 1 kobo/minute. Mail costs 10-30 credits. Video calls cost 60 credits/minute. All features require credits - no free services available.',
        tags: ['credits', 'pricing', 'new_user', 'chat', 'mail'],
        lastUpdated: new Date(),
        helpful: 245,
        notHelpful: 12
      },
      {
        id: 'kb-credits-002',
        category: 'credits',
        question: 'What are kobos?',
        answer: 'Kobos (💖) are special chat credits. 1 kobo = 1 minute of chat time. Kobos are used first before regular credits for chat sessions. New users receive 10 free kobos as a welcome bonus.',
        tags: ['kobos', 'chat', 'credits'],
        lastUpdated: new Date(),
        helpful: 189,
        notHelpful: 8
      },
      {
        id: 'kb-pricing-001',
        category: 'pricing',
        question: 'What does each feature cost?',
        answer: 'Feature pricing: Live Chat (2 credits/min or 1 kobo/min), Send Photos (10 credits), Video Calls (60 credits/min), Audio Calls (50 credits/min), First Mail (10 credits), Following Mail (30 credits), Read Mail (10 credits), Virtual Gifts (varies). Staff members get unlimited access.',
        tags: ['pricing', 'features', 'costs'],
        lastUpdated: new Date(),
        helpful: 312,
        notHelpful: 15
      },

      // Payment Methods
      {
        id: 'kb-payment-001',
        category: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept: Credit/Debit Cards (Visa, MasterCard, Amex), Cryptocurrencies (Bitcoin, Ethereum, USDT, USDC, BNB, ADA, SOL, MATIC, LTC, DOGE), Mobile Payments (Apple Pay, Google Pay, Samsung Pay), PayPal (histogm@gmail.com). All payments secured with 256-bit SSL encryption.',
        tags: ['payment', 'crypto', 'cards', 'paypal'],
        lastUpdated: new Date(),
        helpful: 278,
        notHelpful: 9
      },
      {
        id: 'kb-crypto-001',
        category: 'payment',
        question: 'How do crypto payments work?',
        answer: 'Send exact crypto amount to our official wallet addresses. Bitcoin requires 3 confirmations, Ethereum requires 12. Processing takes 2-30 minutes. Upload payment proof for faster processing. All wallets are officially owned by Dates.care.',
        tags: ['crypto', 'bitcoin', 'ethereum', 'confirmations'],
        lastUpdated: new Date(),
        helpful: 156,
        notHelpful: 7
      },

      // Account & Verification
      {
        id: 'kb-account-001',
        category: 'account',
        question: 'How do I verify my account?',
        answer: 'Account verification requires: Government-issued photo ID, Selfie holding your ID, Address proof document, Phone number verification, Legal name information. Verification takes 24-48 hours and adds a verified badge to your profile.',
        tags: ['verification', 'id', 'documents'],
        lastUpdated: new Date(),
        helpful: 203,
        notHelpful: 11
      },
      {
        id: 'kb-account-002',
        category: 'account',
        question: 'I forgot my password',
        answer: 'Click "Forgot Password" on the sign-in screen. Enter your email address and check for a reset link. If you don\'t receive it, check spam folder or contact support at supports@dates.care.',
        tags: ['password', 'reset', 'login'],
        lastUpdated: new Date(),
        helpful: 167,
        notHelpful: 5
      },

      // Safety & Security
      {
        id: 'kb-safety-001',
        category: 'safety',
        question: 'How do I report or block someone?',
        answer: 'Tap the menu (⋯) on any profile and select "Report" or "Block". Reporting helps our moderation team. Blocking prevents the user from contacting you. We take safety seriously and review all reports within 24 hours.',
        tags: ['safety', 'report', 'block', 'moderation'],
        lastUpdated: new Date(),
        helpful: 234,
        notHelpful: 6
      },
      {
        id: 'kb-safety-002',
        category: 'safety',
        question: 'Is my data secure?',
        answer: 'Yes! We use 256-bit SSL encryption, end-to-end encryption for messages, secure data storage, and credit purchasers get maximum security encryption. Your payment data is never stored on our servers.',
        tags: ['security', 'encryption', 'data_protection'],
        lastUpdated: new Date(),
        helpful: 298,
        notHelpful: 8
      },

      // Technical Support
      {
        id: 'kb-tech-001',
        category: 'technical',
        question: 'The app is not loading properly',
        answer: 'Try these steps: 1) Clear browser cache and cookies, 2) Try a different browser, 3) Check internet connection, 4) Disable browser extensions, 5) Update your browser. If issues persist, contact tech@dates.care.',
        tags: ['technical', 'loading', 'browser', 'troubleshooting'],
        lastUpdated: new Date(),
        helpful: 145,
        notHelpful: 12
      },
      {
        id: 'kb-tech-002',
        category: 'technical',
        question: 'Video/audio calls not working',
        answer: 'Ensure you have sufficient credits (60/min for video, 50/min for audio). Check camera/microphone permissions in browser settings. Try refreshing the page. For persistent issues, contact our technical team.',
        tags: ['video', 'audio', 'calls', 'permissions'],
        lastUpdated: new Date(),
        helpful: 123,
        notHelpful: 9
      },

      // Features & Usage
      {
        id: 'kb-features-001',
        category: 'features',
        question: 'How does matching work?',
        answer: 'Our AI-powered matching algorithm considers your preferences, interests, location, and activity patterns. Premium users get priority placement and advanced matching features. Verified users appear higher in search results.',
        tags: ['matching', 'algorithm', 'ai', 'premium'],
        lastUpdated: new Date(),
        helpful: 267,
        notHelpful: 14
      },
      {
        id: 'kb-features-002',
        category: 'features',
        question: 'What is the difference between messages and mail?',
        answer: 'Messages are for quick chat conversations (2 credits/min). Mail is for longer, private correspondence (10-30 credits per letter). First mail in each thread has special pricing. Both support photos and attachments.',
        tags: ['messages', 'mail', 'chat', 'difference'],
        lastUpdated: new Date(),
        helpful: 178,
        notHelpful: 7
      },

      // Company Information
      {
        id: 'kb-company-001',
        category: 'company',
        question: 'How can I contact Dates.care?',
        answer: 'Contact us: Phone: +1 (613) 861-5799, Email: info@dates.care, Support: supports@dates.care, Technical: tech@dates.care, Address: 5515 Eglinton Ave, Etobicoke, ON, Canada. We offer 24/7 support for urgent matters.',
        tags: ['contact', 'support', 'phone', 'email'],
        lastUpdated: new Date(),
        helpful: 345,
        notHelpful: 3
      }
    ];
  }

  // Create support ticket
  createTicket(
    userId: string,
    userEmail: string,
    userName: string,
    category: AgentTicket['category'],
    subject: string,
    description: string
  ): string {
    const ticketId = 'TKT-' + Math.random().toString(36).substring(2).toUpperCase();
    
    const priority = this.determinePriority(category, description);
    
    const ticket: AgentTicket = {
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
      responses: [],
      tags: this.extractTags(description),
      escalated: false
    };

    this.tickets.set(ticketId, ticket);
    
    // Auto-assign to best available agent
    this.autoAssignTicket(ticketId);
    
    // Send confirmation email
    this.sendTicketConfirmation(ticket);
    
    return ticketId;
  }

  // Determine ticket priority
  private determinePriority(category: string, description: string): AgentTicket['priority'] {
    const urgentKeywords = ['urgent', 'emergency', 'can\'t access', 'payment failed', 'account locked'];
    const highKeywords = ['billing', 'payment', 'verification', 'security'];
    
    const lowerDesc = description.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'urgent';
    }
    
    if (category === 'billing' || category === 'safety' || highKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'high';
    }
    
    if (category === 'technical' || category === 'account') {
      return 'medium';
    }
    
    return 'low';
  }

  // Auto-assign ticket to best available agent
  private autoAssignTicket(ticketId: string): void {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return;

    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.status === 'online' && 
        agent.currentTickets < agent.maxTickets &&
        agent.specializations.includes(ticket.category)
      )
      .sort((a, b) => a.currentTickets - b.currentTickets || a.responseTime - b.responseTime);

    if (availableAgents.length > 0) {
      const assignedAgent = availableAgents[0];
      ticket.assignedAgent = assignedAgent.id;
      ticket.status = 'in_progress';
      assignedAgent.currentTickets++;
      
      // Send assignment notification to agent
      this.notifyAgentAssignment(assignedAgent, ticket);
    }
  }

  // Search knowledge base
  searchKnowledgeBase(query: string): KnowledgeBase[] {
    const queryLower = query.toLowerCase();
    
    return this.knowledgeBase
      .filter(kb => 
        kb.question.toLowerCase().includes(queryLower) ||
        kb.answer.toLowerCase().includes(queryLower) ||
        kb.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, 5);
  }

  // Get AI response for user query
  getAIResponse(query: string): { response: string; confidence: number; suggestedActions?: string[] } {
    const queryLower = query.toLowerCase();
    
    // High confidence responses for exact matches
    if (queryLower.includes('credit') && queryLower.includes('work')) {
      return {
        response: 'Credits are the currency for all Dates.care features. New users get 10 complimentary credits + 10 kobos. Live chat costs 2 credits/minute, mail costs 10-30 credits, video calls cost 60 credits/minute. All features require credits - no free services available. Staff members get unlimited access.',
        confidence: 0.95,
        suggestedActions: ['Buy more credits', 'View pricing', 'Contact billing support']
      };
    }

    if (queryLower.includes('payment') || queryLower.includes('pay')) {
      return {
        response: 'We accept multiple payment methods: Credit/Debit Cards, Cryptocurrencies (Bitcoin, Ethereum, USDT, etc.), Mobile Payments (Apple Pay, Google Pay), and PayPal (histogm@gmail.com). All payments are secured with 256-bit SSL encryption. Crypto payments require confirmations and you can upload proof for faster processing.',
        confidence: 0.92,
        suggestedActions: ['View payment methods', 'Crypto payment help', 'Contact billing']
      };
    }

    if (queryLower.includes('verify') || queryLower.includes('verification')) {
      return {
        response: 'Account verification requires: Government-issued photo ID, Selfie holding your ID, Address proof, Phone verification, and Legal name. The process takes 24-48 hours. Verified users get a blue badge and priority in search results.',
        confidence: 0.90,
        suggestedActions: ['Start verification', 'Upload documents', 'Check verification status']
      };
    }

    if (queryLower.includes('safe') || queryLower.includes('report') || queryLower.includes('block')) {
      return {
        response: 'Your safety is our priority. You can report or block users by tapping the menu (⋯) on their profile. We use end-to-end encryption, content moderation, and 24/7 monitoring. Always meet in public places for first dates.',
        confidence: 0.88,
        suggestedActions: ['Safety tips', 'Report user', 'Contact safety team']
      };
    }

    if (queryLower.includes('technical') || queryLower.includes('not working') || queryLower.includes('error')) {
      return {
        response: 'For technical issues, try: Clear browser cache, use a different browser, check internet connection, update browser, disable extensions. For video/audio issues, check camera/microphone permissions. Contact tech@dates.care for complex issues.',
        confidence: 0.85,
        suggestedActions: ['Clear cache', 'Try different browser', 'Contact tech support']
      };
    }

    if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help')) {
      return {
        response: 'Contact Dates.care: Phone: +1 (613) 861-5799, Email: supports@dates.care, Technical: tech@dates.care, Billing: billing@dates.care, Address: 5515 Eglinton Ave, Etobicoke, ON, Canada. We provide 24/7 support for urgent matters.',
        confidence: 0.93,
        suggestedActions: ['Call support', 'Email support', 'Create ticket']
      };
    }

    // Medium confidence responses
    const knowledgeResults = this.searchKnowledgeBase(query);
    if (knowledgeResults.length > 0) {
      return {
        response: knowledgeResults[0].answer,
        confidence: 0.75,
        suggestedActions: ['View more help articles', 'Contact support', 'Create ticket']
      };
    }

    // Low confidence fallback
    return {
      response: 'I understand you need assistance. For the best help, please contact our human support team at supports@dates.care or call +1 (613) 861-5799. You can also create a support ticket for detailed assistance. Our team responds within 24 hours.',
      confidence: 0.40,
      suggestedActions: ['Contact human support', 'Create support ticket', 'Browse help articles']
    };
  }

  // Extract tags from text
  private extractTags(text: string): string[] {
    const keywords = ['credit', 'payment', 'crypto', 'verification', 'technical', 'safety', 'billing', 'account'];
    const textLower = text.toLowerCase();
    return keywords.filter(keyword => textLower.includes(keyword));
  }

  // Send ticket confirmation
  private sendTicketConfirmation(ticket: AgentTicket): void {
    console.log(`📧 Ticket confirmation sent to ${ticket.userEmail}:`);
    console.log(`Subject: Dates.care Support - Ticket ${ticket.id} Created`);
    console.log(`Your support request has been received. Ticket ID: ${ticket.id}`);
    console.log(`Priority: ${ticket.priority.toUpperCase()}`);
    console.log(`Expected response time: ${this.getExpectedResponseTime(ticket.priority)}`);
  }

  // Get expected response time
  private getExpectedResponseTime(priority: AgentTicket['priority']): string {
    switch (priority) {
      case 'urgent': return '15 minutes';
      case 'high': return '1 hour';
      case 'medium': return '4 hours';
      case 'low': return '24 hours';
      default: return '24 hours';
    }
  }

  // Notify agent of assignment
  private notifyAgentAssignment(agent: SupportAgent, ticket: AgentTicket): void {
    console.log(`🔔 Agent ${agent.name} assigned to ticket ${ticket.id}`);
    console.log(`Priority: ${ticket.priority}, Category: ${ticket.category}`);
  }

  // Get ticket by ID
  getTicket(ticketId: string): AgentTicket | null {
    return this.tickets.get(ticketId) || null;
  }

  // Get user tickets
  getUserTickets(userId: string): AgentTicket[] {
    return Array.from(this.tickets.values()).filter(ticket => ticket.userId === userId);
  }

  // Get agent workload
  getAgentWorkload(): { agent: SupportAgent; workload: number }[] {
    return Array.from(this.agents.values()).map(agent => ({
      agent,
      workload: (agent.currentTickets / agent.maxTickets) * 100
    }));
  }

  // Escalate ticket
  escalateTicket(ticketId: string, reason: string): boolean {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.escalated = true;
      ticket.priority = 'urgent';
      ticket.updatedAt = new Date();
      
      // Notify management
      console.log(`🚨 Ticket ${ticketId} escalated: ${reason}`);
      return true;
    }
    return false;
  }

  // Add response to ticket
  addResponse(
    ticketId: string,
    responderId: string,
    responderType: 'user' | 'agent' | 'ai',
    message: string,
    internal: boolean = false
  ): boolean {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      const response: AgentResponse = {
        id: Math.random().toString(36).substring(2),
        ticketId,
        responderId,
        responderType,
        message,
        timestamp: new Date(),
        internal
      };

      ticket.responses.push(response);
      ticket.updatedAt = new Date();
      
      if (responderType === 'user') {
        ticket.status = 'waiting_user';
      } else if (responderType === 'agent') {
        ticket.status = 'in_progress';
      }

      return true;
    }
    return false;
  }

  // Get support statistics
  getSupportStats(): {
    totalTickets: number;
    openTickets: number;
    averageResponseTime: number;
    satisfactionRating: number;
    agentsOnline: number;
  } {
    const tickets = Array.from(this.tickets.values());
    const agents = Array.from(this.agents.values());

    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
      averageResponseTime: agents.reduce((sum, agent) => sum + agent.responseTime, 0) / agents.length,
      satisfactionRating: agents.reduce((sum, agent) => sum + agent.satisfactionRating, 0) / agents.length,
      agentsOnline: agents.filter(agent => agent.status === 'online').length
    };
  }
}

export const agentAssistant = new AgentAssistantManager();

// Utility functions
export const createSupportTicket = (
  userId: string,
  userEmail: string,
  userName: string,
  category: AgentTicket['category'],
  subject: string,
  description: string
): string => {
  return agentAssistant.createTicket(userId, userEmail, userName, category, subject, description);
};

export const getAIResponse = (query: string) => {
  return agentAssistant.getAIResponse(query);
};

export const searchHelp = (query: string) => {
  return agentAssistant.searchKnowledgeBase(query);
};