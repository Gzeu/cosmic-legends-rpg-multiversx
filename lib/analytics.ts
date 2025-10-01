import { NextApiRequest } from 'next';

// Advanced Analytics & Performance Monitoring System
// For tracking user engagement, game performance, and business metrics

interface GameEvent {
  event: string;
  player_id: string;
  session_id: string;
  timestamp: number;
  properties: Record<string, any>;
  value?: number;
}

interface PerformanceMetrics {
  page_load_time: number;
  api_response_time: number;
  transaction_time: number;
  error_count: number;
  fps: number;
}

interface UserEngagement {
  session_duration: number;
  actions_per_session: number;
  pages_visited: number;
  features_used: string[];
  revenue_generated: number;
}

class CosmicAnalytics {
  private static instance: CosmicAnalytics;
  private events: GameEvent[] = [];
  private sessionId: string;
  private playerId: string | null = null;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    // Auto-track page performance
    if (typeof window !== 'undefined') {
      this.trackPagePerformance();
      this.trackUserInteractions();
    }
  }

  static getInstance(): CosmicAnalytics {
    if (!CosmicAnalytics.instance) {
      CosmicAnalytics.instance = new CosmicAnalytics();
    }
    return CosmicAnalytics.instance;
  }

  // User Identity & Session Management
  identify(playerId: string, properties?: Record<string, any>) {
    this.playerId = playerId;
    this.track('user_identified', {
      player_id: playerId,
      ...properties
    });
  }

  // Core Event Tracking
  track(event: string, properties: Record<string, any> = {}, value?: number) {
    const gameEvent: GameEvent = {
      event,
      player_id: this.playerId || 'anonymous',
      session_id: this.sessionId,
      timestamp: Date.now(),
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        session_duration: Date.now() - this.startTime
      },
      value
    };

    this.events.push(gameEvent);
    this.sendToAnalytics(gameEvent);
  }

  // Game-Specific Analytics
  trackGameplay(action: string, context: Record<string, any>) {
    this.track(`gameplay_${action}`, {
      category: 'gameplay',
      ...context
    });
  }

  trackTransaction(type: 'nft_purchase' | 'nft_sale' | 'token_transfer', details: {
    amount: number;
    token_type: string;
    transaction_hash?: string;
    gas_fee?: number;
  }) {
    this.track(`transaction_${type}`, {
      category: 'transaction',
      ...details
    }, details.amount);
  }

  trackBattle(result: 'victory' | 'defeat' | 'draw', metrics: {
    duration: number;
    opponent_id?: string;
    damage_dealt: number;
    damage_received: number;
    strategy_used: string;
  }) {
    this.track(`battle_${result}`, {
      category: 'combat',
      ...metrics
    });
  }

  trackNFTAction(action: 'mint' | 'trade' | 'upgrade' | 'evolve', nft: {
    token_id: string;
    rarity: string;
    type: string;
    level?: number;
    price?: number;
  }) {
    this.track(`nft_${action}`, {
      category: 'nft',
      ...nft
    }, nft.price);
  }

  // Performance Monitoring
  trackPerformance(metrics: PerformanceMetrics) {
    this.track('performance_metrics', {
      category: 'performance',
      ...metrics
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error_occurred', {
      category: 'error',
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }

  // Revenue Analytics
  trackRevenue(amount: number, currency: string, source: string) {
    this.track('revenue_generated', {
      category: 'revenue',
      currency,
      source,
      amount
    }, amount);
  }

  // User Engagement Metrics
  trackEngagement(metrics: UserEngagement) {
    this.track('engagement_metrics', {
      category: 'engagement',
      ...metrics
    });
  }

  // AI & Machine Learning Analytics
  trackAIInteraction(type: 'chat' | 'generation' | 'recommendation', data: {
    model_used: string;
    prompt_tokens?: number;
    completion_tokens?: number;
    response_time: number;
    satisfaction_score?: number;
  }) {
    this.track(`ai_${type}`, {
      category: 'ai',
      ...data
    });
  }

  // Cross-Chain Analytics
  trackCrossChain(action: 'bridge' | 'swap' | 'transfer', details: {
    from_chain: string;
    to_chain: string;
    asset: string;
    amount: number;
    fee: number;
  }) {
    this.track(`crosschain_${action}`, {
      category: 'crosschain',
      ...details
    });
  }

  // Advanced Analytics Functions
  private trackPagePerformance() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.trackPerformance({
          page_load_time: navigation.loadEventEnd - navigation.fetchStart,
          api_response_time: 0, // Will be tracked per API call
          transaction_time: 0, // Will be tracked per transaction
          error_count: 0, // Will be incremented on errors
          fps: this.measureFPS()
        });
      }, 1000);
    });
  }

  private trackUserInteractions() {
    if (typeof window === 'undefined') return;

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.track('user_click', {
        element_type: target.tagName,
        element_id: target.id,
        element_class: target.className,
        page_x: event.pageX,
        page_y: event.pageY
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (scrollPercent % 25 === 0) {
          this.track('scroll_depth', { percent: scrollPercent });
        }
      }
    });
  }

  private measureFPS(): number {
    let fps = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (frameCount < 60) {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);
    return fps;
  }

  private generateSessionId(): string {
    return `cosmic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToAnalytics(event: GameEvent) {
    try {
      // Send to multiple analytics providers
      await Promise.all([
        this.sendToCustomAPI(event),
        this.sendToGoogleAnalytics(event),
        this.sendToMixpanel(event)
      ]);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  private async sendToCustomAPI(event: GameEvent) {
    if (typeof window === 'undefined') return;
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
    }
  }

  private sendToGoogleAnalytics(event: GameEvent) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', event.event, {
      custom_parameter_1: event.properties,
      value: event.value
    });
  }

  private sendToMixpanel(event: GameEvent) {
    if (typeof window === 'undefined' || !window.mixpanel) return;

    window.mixpanel.track(event.event, {
      ...event.properties,
      session_id: event.session_id,
      player_id: event.player_id
    });
  }

  // Data Export & Analysis
  exportData(): GameEvent[] {
    return [...this.events];
  }

  getSessionMetrics() {
    return {
      session_id: this.sessionId,
      duration: Date.now() - this.startTime,
      events_count: this.events.length,
      unique_events: [...new Set(this.events.map(e => e.event))].length,
      total_value: this.events.reduce((sum, e) => sum + (e.value || 0), 0)
    };
  }
}

// Global Analytics Instance
export const analytics = CosmicAnalytics.getInstance();

// Convenience functions
export const trackEvent = (event: string, properties?: Record<string, any>, value?: number) => {
  analytics.track(event, properties, value);
};

export const trackGameplay = (action: string, context: Record<string, any>) => {
  analytics.trackGameplay(action, context);
};

export const trackTransaction = analytics.trackTransaction.bind(analytics);
export const trackBattle = analytics.trackBattle.bind(analytics);
export const trackNFT = analytics.trackNFTAction.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);
export const trackRevenue = analytics.trackRevenue.bind(analytics);

// Type declarations for global analytics
declare global {
  interface Window {
    gtag: any;
    mixpanel: any;
  }
}

export default analytics;
