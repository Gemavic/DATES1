import React from 'react';
import { Crown, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, loading, getProductName, isActive } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-white/80 text-sm">Loading subscription...</span>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-white/80 text-sm">No active subscription</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isActive()) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (subscription.subscription_status === 'past_due') {
      return <Clock className="w-4 h-4 text-yellow-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = () => {
    if (isActive()) return 'text-green-400';
    if (subscription.subscription_status === 'past_due') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusText = () => {
    switch (subscription.subscription_status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Cancelled';
      case 'incomplete':
        return 'Incomplete';
      default:
        return subscription.subscription_status;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isActive() && <Crown className="w-4 h-4 text-yellow-400" />}
          {getStatusIcon()}
          <span className="text-white font-medium text-sm">
            {getProductName() || 'Care'}
          </span>
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {subscription.current_period_end && isActive() && (
        <div className="mt-2 text-white/60 text-xs">
          {subscription.subscription_status === 'active' ? 'Renews' : 'Expires'} on{' '}
          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};