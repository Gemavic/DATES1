import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Gift, Heart, Star, Crown, Coffee, Flower2 } from 'lucide-react';
import { creditManager, formatCredits, GiftItem } from '@/lib/creditSystem';

interface GiftShopProps {
  onNavigate: (screen: string) => void;
}

export const GiftShop: React.FC<GiftShopProps> = ({ onNavigate }) => {
  const [userBalance, setUserBalance] = React.useState(creditManager.getTotalCredits('current-user'));
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const giftCatalog = creditManager.getGiftCatalog();
  
  const categories = [
    { id: 'all', name: 'All Gifts', icon: Gift, color: 'from-purple-500 to-pink-500' },
    {
      id: 'romantic',
      name: 'Romantic',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'fun',
      name: 'Fun & Cute',
      icon: Star,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'casual',
      name: 'Casual',
      icon: Coffee,
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'seasonal',
      name: 'Seasonal',
      icon: Flower2,
      color: 'from-orange-500 to-red-500',
    }
  ];

  const filteredGifts = selectedCategory === 'all' 
    ? giftCatalog 
    : giftCatalog.filter(gift => gift.category === selectedCategory);

  const sortedGifts = filteredGifts.sort((a, b) => b.popularity - a.popularity);

  const sendGift = (giftId: string, giftName: string, price: number) => {
    if (!creditManager.canAfford('current-user', price)) {
      alert(`You need ${formatCredits(price)} to send this gift!`);
      return;
    }

    const success = creditManager.spendCredits('current-user', price, `Sent ${giftName} gift`);
    if (success) {
      setUserBalance(creditManager.getTotalCredits('current-user'));
      alert(`🎁 Successfully sent ${giftName} for ${formatCredits(price)}!`);
    } else {
      alert('Failed to send gift. Please try again.');
    }
  };

  return (
    <Layout
      title="Gift Shop"
      onBack={() => onNavigate('discovery')}
      showClose={false}
    >
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Gift Shop" 
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
          />
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Gift Shop</h2>
          <p className="text-white/80">Send virtual gifts to show you care</p>
        </div>

        {/* Credits Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Your Credits</p>
              <p className="text-2xl font-bold text-white">{formatCredits(userBalance)}</p>
            </div>
            <Button
              onClick={() => onNavigate('credits')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2"
            >
              Buy More
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gift Categories */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">
              {selectedCategory === 'all' ? 'All Gifts' : categories.find(c => c.id === selectedCategory)?.name} 
              ({sortedGifts.length} items)
            </h3>
            <span className="text-white/70 text-sm">💖 Popular</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedGifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-white/10 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 flex flex-col justify-between min-h-[180px]"
              >
                <div className="text-3xl mb-2">{gift.emoji}</div>
                <h4 className="text-white font-medium text-sm mb-1">{gift.name}</h4>
                <p className="text-white/60 text-xs mb-2">{gift.description}</p>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <span className="text-white/70 text-xs">{formatCredits(gift.price)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(gift.popularity / 20) ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto">
                  <Button
                    onClick={() => sendGift(gift.id, gift.name, gift.price)}
                    disabled={!creditManager.canAfford('current-user', gift.price)}
                    className={`w-full text-xs py-2 transition-all duration-300 ${
                      creditManager.canAfford('current-user', gift.price)
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 cursor-pointer'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {creditManager.canAfford('current-user', gift.price) ? 'Send Gift' : 'Need Credits'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Gifts */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-semibold text-lg mb-4">Recent Gifts Sent</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌹</span>
                <div>
                  <p className="text-white font-medium">Red Rose to Emma</p>
                  <p className="text-white/70 text-sm">2 hours ago</p>
                </div>
              </div>
              <span className="text-white/70 text-sm">5 Credits</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💖</span>
                <div>
                  <p className="text-white font-medium">Love Heart to Sarah</p>
                  <p className="text-white/70 text-sm">1 day ago</p>
                </div>
              </div>
              <span className="text-white/70 text-sm">3 Credits</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧸</span>
                <div>
                  <p className="text-white font-medium">Teddy Bear to Jessica</p>
                  <p className="text-white/70 text-sm">3 days ago</p>
                </div>
              </div>
              <span className="text-white/70 text-sm">8 Credits</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};