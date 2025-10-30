import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import {
  Trophy,
  Star,
  Gift,
  TrendingUp,
  Calendar,
  Award,
  Crown,
  Sparkles,
  Check,
  Lock,
  Percent,
  DollarSign,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { Customer, LoyaltyTier, LoyaltyTierConfig, LoyaltyReward } from '../../../lib/types';
import { toast } from 'sonner@2.0.3';

interface LoyaltyProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  onRedeemReward?: (rewardId: string) => void;
}

// Default tier configuration
const defaultTiers: LoyaltyTierConfig[] = [
  {
    tier: 'bronze',
    name: 'Bronze',
    color: '#CD7F32',
    icon: 'award',
    minPoints: 0,
    maxPoints: 499,
    benefits: ['Earn 1 point per $1 spent', 'Birthday bonus points', 'Exclusive member-only offers'],
    pointsMultiplier: 1.0,
    discountPercentage: 0,
  },
  {
    tier: 'silver',
    name: 'Silver',
    color: '#C0C0C0',
    icon: 'star',
    minPoints: 500,
    maxPoints: 1499,
    benefits: ['Earn 1.2x points per $1 spent', '5% discount on all orders', 'Priority support', 'Early access to new menu items'],
    pointsMultiplier: 1.2,
    discountPercentage: 5,
  },
  {
    tier: 'gold',
    name: 'Gold',
    color: '#FFD700',
    icon: 'trophy',
    minPoints: 1500,
    maxPoints: 2999,
    benefits: ['Earn 1.5x points per $1 spent', '10% discount on all orders', 'Free delivery', 'Birthday gift', 'VIP events'],
    pointsMultiplier: 1.5,
    discountPercentage: 10,
  },
  {
    tier: 'platinum',
    name: 'Platinum',
    color: '#E5E4E2',
    icon: 'crown',
    minPoints: 3000,
    benefits: ['Earn 2x points per $1 spent', '15% discount on all orders', 'Free delivery', 'Concierge service', 'Exclusive tasting events', 'Personal chef recommendations'],
    pointsMultiplier: 2.0,
    discountPercentage: 15,
  },
];

// Sample rewards catalog
const defaultRewards: LoyaltyReward[] = [
  {
    id: 'reward-1',
    name: '$5 Off Any Order',
    description: 'Get $5 off your next purchase',
    pointsCost: 100,
    rewardType: 'discount-fixed',
    discountValue: 5,
    isActive: true,
  },
  {
    id: 'reward-2',
    name: '10% Off Order',
    description: 'Save 10% on your entire order',
    pointsCost: 150,
    rewardType: 'discount-percentage',
    discountValue: 10,
    isActive: true,
  },
  {
    id: 'reward-3',
    name: 'Free Appetizer',
    description: 'Complimentary appetizer with any entree',
    pointsCost: 250,
    rewardType: 'free-item',
    isActive: true,
  },
  {
    id: 'reward-4',
    name: '$10 Off $50+',
    description: 'Get $10 off orders of $50 or more',
    pointsCost: 200,
    rewardType: 'discount-fixed',
    discountValue: 10,
    isActive: true,
    minTier: 'silver',
  },
  {
    id: 'reward-5',
    name: '20% Off Order',
    description: 'Save 20% on your entire order',
    pointsCost: 350,
    rewardType: 'discount-percentage',
    discountValue: 20,
    isActive: true,
    minTier: 'gold',
  },
  {
    id: 'reward-6',
    name: 'Free Dessert',
    description: 'Complimentary dessert of your choice',
    pointsCost: 300,
    rewardType: 'free-item',
    isActive: true,
    minTier: 'silver',
  },
];

export function LoyaltyProgramDialog({
  open,
  onOpenChange,
  customer,
  onRedeemReward,
}: LoyaltyProgramDialogProps) {
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);

  // Get customer's current tier
  const currentTier = customer.loyaltyTier || 'bronze';
  const currentPoints = customer.loyaltyPoints || 0;
  const pointsEarned = customer.pointsEarned || 0;
  const pointsRedeemed = customer.pointsRedeemed || 0;
  const rewardsRedeemed = customer.rewardsRedeemed || 0;

  // Find tier configuration
  const tierConfig = defaultTiers.find(t => t.tier === currentTier) || defaultTiers[0];
  const tierIndex = defaultTiers.findIndex(t => t.tier === currentTier);
  const nextTier = tierIndex < defaultTiers.length - 1 ? defaultTiers[tierIndex + 1] : null;

  // Calculate progress to next tier
  const progressToNextTier = useMemo(() => {
    if (!nextTier) return 100; // Already at highest tier
    const currentMin = tierConfig.minPoints;
    const nextMin = nextTier.minPoints;
    const range = nextMin - currentMin;
    const progress = currentPoints - currentMin;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }, [currentPoints, tierConfig, nextTier]);

  const pointsToNextTier = nextTier ? nextTier.minPoints - currentPoints : 0;

  // Filter available rewards
  const availableRewards = useMemo(() => {
    return defaultRewards.filter(reward => {
      // Check if reward is active
      if (!reward.isActive) return false;
      
      // Check if customer's tier is high enough
      if (reward.minTier) {
        const rewardTierIndex = defaultTiers.findIndex(t => t.tier === reward.minTier);
        if (tierIndex < rewardTierIndex) return false;
      }
      
      return true;
    });
  }, [tierIndex]);

  // Separate rewards into affordable and locked
  const affordableRewards = availableRewards.filter(r => r.pointsCost <= currentPoints);
  const lockedRewards = availableRewards.filter(r => r.pointsCost > currentPoints);

  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (reward.pointsCost > currentPoints) {
      toast.error('Not enough points to redeem this reward');
      return;
    }

    setSelectedReward(reward);
    toast.success(`Reward "${reward.name}" selected for redemption`);
    
    if (onRedeemReward) {
      onRedeemReward(reward.id);
    }
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'bronze': return Award;
      case 'silver': return Star;
      case 'gold': return Trophy;
      case 'platinum': return Crown;
      default: return Award;
    }
  };

  const TierIcon = getTierIcon(currentTier);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${tierConfig.color}20` }}>
              <TierIcon className="w-6 h-6" style={{ color: tierConfig.color }} />
            </div>
            {customer.name} - Loyalty Program
          </DialogTitle>
          <DialogDescription>
            Your rewards and benefits at a glance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="tiers">Tier Benefits</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              {/* Current Status Card */}
              <Card className="border-2" style={{ borderColor: tierConfig.color }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${tierConfig.color}20` }}>
                        <TierIcon className="w-7 h-7" style={{ color: tierConfig.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tierConfig.name} Member</CardTitle>
                        <CardDescription>Current tier status</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{currentPoints}</div>
                      <div className="text-sm text-muted-foreground">Points Available</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nextTier && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progress to {nextTier.name}
                        </span>
                        <span className="font-medium">
                          {pointsToNextTier} points to go
                        </span>
                      </div>
                      <Progress value={progressToNextTier} className="h-3" />
                    </div>
                  )}

                  {!nextTier && (
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                      <Crown className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">Highest tier achieved! 🎉</span>
                    </div>
                  )}

                  <Separator />

                  {/* Current Benefits */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Your Active Benefits
                    </h4>
                    <ul className="space-y-2">
                      {tierConfig.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{pointsEarned}</div>
                      <div className="text-xs text-muted-foreground">Points Earned</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Gift className="w-8 h-8 text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{pointsRedeemed}</div>
                      <div className="text-xs text-muted-foreground">Points Redeemed</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <ShoppingBag className="w-8 h-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{rewardsRedeemed}</div>
                      <div className="text-xs text-muted-foreground">Rewards Used</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <DollarSign className="w-8 h-8 text-orange-500 mb-2" />
                      <div className="text-2xl font-bold">${(customer.totalSpent || 0).toFixed(0)}</div>
                      <div className="text-xs text-muted-foreground">Total Spent</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    How to Earn More Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">Make Purchases</div>
                      <div className="text-sm text-muted-foreground">
                        Earn {tierConfig.pointsMultiplier}x points on every dollar spent
                      </div>
                    </div>
                    <Badge>{tierConfig.pointsMultiplier}x</Badge>
                  </div>

                  {customer.birthday && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Birthday Bonus</div>
                        <div className="text-sm text-muted-foreground">
                          Get bonus points on your birthday
                        </div>
                      </div>
                      <Badge variant="secondary">50 pts</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              {/* Available Rewards */}
              {affordableRewards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    Available Rewards ({affordableRewards.length})
                  </h3>

                  <div className="grid gap-3">
                    {affordableRewards.map((reward) => (
                      <Card key={reward.id} className="border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{reward.name}</h4>
                                {reward.minTier && (
                                  <Badge variant="outline" className="text-xs">
                                    {defaultTiers.find(t => t.tier === reward.minTier)?.name}+
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {reward.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-600">
                                  {reward.pointsCost} points
                                </Badge>
                                {reward.rewardType === 'discount-percentage' && (
                                  <Badge variant="outline">
                                    <Percent className="w-3 h-3 mr-1" />
                                    {reward.discountValue}% off
                                  </Badge>
                                )}
                                {reward.rewardType === 'discount-fixed' && (
                                  <Badge variant="outline">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    ${reward.discountValue} off
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleRedeemReward(reward)}
                            >
                              Redeem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {affordableRewards.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Keep earning points to unlock rewards!
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Locked Rewards */}
              {lockedRewards.length > 0 && (
                <div className="space-y-3 mt-6">
                  <Separator />
                  <h3 className="font-medium flex items-center gap-2 mt-4">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    Locked Rewards ({lockedRewards.length})
                  </h3>

                  <div className="grid gap-3">
                    {lockedRewards.map((reward) => {
                      const pointsNeeded = reward.pointsCost - currentPoints;
                      return (
                        <Card key={reward.id} className="opacity-60">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{reward.name}</h4>
                                  {reward.minTier && (
                                    <Badge variant="outline" className="text-xs">
                                      {defaultTiers.find(t => t.tier === reward.minTier)?.name}+
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {reward.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {reward.pointsCost} points
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Need {pointsNeeded} more points
                                  </span>
                                </div>
                              </div>
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers" className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {defaultTiers.map((tier, index) => {
                  const Icon = getTierIcon(tier.tier);
                  const isCurrentTier = tier.tier === currentTier;
                  const isUnlocked = index <= tierIndex;

                  return (
                    <Card 
                      key={tier.tier}
                      className={`transition-all ${
                        isCurrentTier 
                          ? 'border-2 shadow-lg' 
                          : isUnlocked 
                          ? 'border' 
                          : 'border-dashed opacity-60'
                      }`}
                      style={isCurrentTier ? { borderColor: tier.color } : {}}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${tier.color}20` }}
                            >
                              <Icon className="w-7 h-7" style={{ color: tier.color }} />
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {tier.name}
                                {isCurrentTier && (
                                  <Badge style={{ backgroundColor: tier.color }}>
                                    Current
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {tier.maxPoints 
                                  ? `${tier.minPoints} - ${tier.maxPoints} points`
                                  : `${tier.minPoints}+ points`}
                              </CardDescription>
                            </div>
                          </div>
                          {!isUnlocked && (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Tier multiplier and discount */}
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {tier.pointsMultiplier}x points
                          </Badge>
                          {tier.discountPercentage && tier.discountPercentage > 0 && (
                            <Badge variant="outline">
                              <Percent className="w-3 h-3 mr-1" />
                              {tier.discountPercentage}% discount
                            </Badge>
                          )}
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Benefits</h4>
                          <ul className="space-y-2">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className={!isUnlocked ? 'text-muted-foreground' : ''}>
                                  {benefit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
