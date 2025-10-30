import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  Trophy,
  Star,
  Gift,
  Award,
  Crown,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  TrendingUp,
  DollarSign,
  Users,
  Percent
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoyaltySettings {
  enabled: boolean;
  pointsPerDollar: number;
  minPurchaseForPoints: number;
  pointsExpireDays: number;
  welcomeBonus: number;
  birthdayBonus: number;
  autoApplyTierDiscounts: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  rewardType: 'discount-percentage' | 'discount-fixed' | 'free-item' | 'special-offer';
  discountValue?: number;
  productId?: string;
  isActive: boolean;
  minTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export function LoyaltyModule() {
  // Settings state
  const [settings, setSettings] = useState<LoyaltySettings>({
    enabled: true,
    pointsPerDollar: 1,
    minPurchaseForPoints: 0,
    pointsExpireDays: 0,
    welcomeBonus: 50,
    birthdayBonus: 100,
    autoApplyTierDiscounts: true,
  });

  // Rewards state
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      name: '$5 Off Any Order',
      description: 'Get $5 off your next purchase',
      pointsCost: 100,
      rewardType: 'discount-fixed',
      discountValue: 5,
      isActive: true,
    },
    {
      id: '2',
      name: '10% Off Order',
      description: 'Save 10% on your entire order',
      pointsCost: 150,
      rewardType: 'discount-percentage',
      discountValue: 10,
      isActive: true,
    },
    {
      id: '3',
      name: 'Free Appetizer',
      description: 'Complimentary appetizer with any entree',
      pointsCost: 250,
      rewardType: 'free-item',
      isActive: true,
    },
  ]);

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState<Partial<Reward>>({
    name: '',
    description: '',
    pointsCost: 100,
    rewardType: 'discount-percentage',
    discountValue: 0,
    isActive: true,
  });

  const handleSaveSettings = () => {
    toast.success('Loyalty program settings saved successfully');
  };

  const handleOpenRewardDialog = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setRewardForm(reward);
    } else {
      setEditingReward(null);
      setRewardForm({
        name: '',
        description: '',
        pointsCost: 100,
        rewardType: 'discount-percentage',
        discountValue: 0,
        isActive: true,
      });
    }
    setIsRewardDialogOpen(true);
  };

  const handleSaveReward = () => {
    if (!rewardForm.name || !rewardForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? { ...editingReward, ...rewardForm } as Reward : r));
      toast.success('Reward updated successfully');
    } else {
      const newReward: Reward = {
        ...rewardForm,
        id: Date.now().toString(),
      } as Reward;
      setRewards([...rewards, newReward]);
      toast.success('Reward created successfully');
    }

    setIsRewardDialogOpen(false);
  };

  const handleDeleteReward = (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      setRewards(rewards.filter(r => r.id !== rewardId));
      toast.success('Reward deleted successfully');
    }
  };

  const handleToggleReward = (rewardId: string) => {
    setRewards(rewards.map(r => 
      r.id === rewardId ? { ...r, isActive: !r.isActive } : r
    ));
    toast.success('Reward status updated');
  };

  // Mock statistics
  const stats = {
    totalMembers: 1247,
    activeMembers: 892,
    pointsDistributed: 125430,
    rewardsRedeemed: 342,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Loyalty Program</h2>
          <p className="text-muted-foreground text-sm">
            Manage customer loyalty points, tiers, and rewards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={settings.enabled ? 'default' : 'secondary'} className="px-3 py-1">
            {settings.enabled ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Members</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              {stats.totalMembers}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Members</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              {stats.activeMembers}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Points Distributed</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              {stats.pointsDistributed.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rewards Redeemed</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-500" />
              {stats.rewardsRedeemed}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="tiers">Tier Configuration</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Settings</CardTitle>
              <CardDescription>
                Configure how your loyalty program works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Loyalty Program</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn the loyalty program on or off
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enabled: checked })
                  }
                />
              </div>

              <Separator />

              {/* Points Configuration */}
              <div className="space-y-4">
                <h3 className="font-medium">Points Configuration</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsPerDollar">Points Per Dollar Spent</Label>
                    <Input
                      id="pointsPerDollar"
                      type="number"
                      min="0"
                      step="0.1"
                      value={settings.pointsPerDollar}
                      onChange={(e) => 
                        setSettings({ ...settings, pointsPerDollar: parseFloat(e.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Base points earned per $1 spent
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimum Purchase For Points</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      min="0"
                      step="1"
                      value={settings.minPurchaseForPoints}
                      onChange={(e) => 
                        setSettings({ ...settings, minPurchaseForPoints: parseFloat(e.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      $0 = no minimum
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcomeBonus">Welcome Bonus Points</Label>
                    <Input
                      id="welcomeBonus"
                      type="number"
                      min="0"
                      step="10"
                      value={settings.welcomeBonus}
                      onChange={(e) => 
                        setSettings({ ...settings, welcomeBonus: parseInt(e.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Points given when customer joins
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdayBonus">Birthday Bonus Points</Label>
                    <Input
                      id="birthdayBonus"
                      type="number"
                      min="0"
                      step="10"
                      value={settings.birthdayBonus}
                      onChange={(e) => 
                        setSettings({ ...settings, birthdayBonus: parseInt(e.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Bonus points on customer's birthday
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="expiryDays">Points Expiration (Days)</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      min="0"
                      step="30"
                      value={settings.pointsExpireDays}
                      onChange={(e) => 
                        setSettings({ ...settings, pointsExpireDays: parseInt(e.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 for points that never expire
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Auto-apply discounts */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Apply Tier Discounts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply tier discounts at checkout
                  </p>
                </div>
                <Switch
                  checked={settings.autoApplyTierDiscounts}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, autoApplyTierDiscounts: checked })
                  }
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage rewards that customers can redeem with points
            </p>
            <Button onClick={() => handleOpenRewardDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reward
            </Button>
          </div>

          <div className="grid gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{reward.name}</h3>
                        <Badge variant={reward.isActive ? 'default' : 'secondary'}>
                          {reward.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {reward.minTier && (
                          <Badge variant="outline" className="text-xs">
                            {reward.minTier}+
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-purple-600 dark:bg-purple-600">
                          <Trophy className="w-3 h-3 mr-1" />
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
                        {reward.rewardType === 'free-item' && (
                          <Badge variant="outline">
                            <Gift className="w-3 h-3 mr-1" />
                            Free Item
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reward.isActive}
                        onCheckedChange={() => handleToggleReward(reward.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRewardDialog(reward)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {rewards.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No rewards created yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => handleOpenRewardDialog()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Reward
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure loyalty tier levels and benefits
          </p>

          <div className="grid gap-4">
            {/* Bronze Tier */}
            <Card className="border-2" style={{ borderColor: '#CD7F32' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CD7F3220' }}>
                    <Award className="w-6 h-6" style={{ color: '#CD7F32' }} />
                  </div>
                  <div>
                    <CardTitle>Bronze Tier</CardTitle>
                    <CardDescription>0 - 499 points</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Points Multiplier</Label>
                    <div className="font-medium">1.0x</div>
                  </div>
                  <div>
                    <Label className="text-xs">Tier Discount</Label>
                    <div className="font-medium">0%</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Benefits</Label>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Earn 1 point per $1 spent</li>
                    <li>• Birthday bonus points</li>
                    <li>• Exclusive member offers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Silver Tier */}
            <Card className="border-2" style={{ borderColor: '#C0C0C0' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C0C0C020' }}>
                    <Star className="w-6 h-6" style={{ color: '#C0C0C0' }} />
                  </div>
                  <div>
                    <CardTitle>Silver Tier</CardTitle>
                    <CardDescription>500 - 1,499 points</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Points Multiplier</Label>
                    <div className="font-medium">1.2x</div>
                  </div>
                  <div>
                    <Label className="text-xs">Tier Discount</Label>
                    <div className="font-medium">5%</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Benefits</Label>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Earn 1.2x points</li>
                    <li>• 5% discount on all orders</li>
                    <li>• Priority support</li>
                    <li>• Early access to new items</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Gold Tier */}
            <Card className="border-2" style={{ borderColor: '#FFD700' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD70020' }}>
                    <Trophy className="w-6 h-6" style={{ color: '#FFD700' }} />
                  </div>
                  <div>
                    <CardTitle>Gold Tier</CardTitle>
                    <CardDescription>1,500 - 2,999 points</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Points Multiplier</Label>
                    <div className="font-medium">1.5x</div>
                  </div>
                  <div>
                    <Label className="text-xs">Tier Discount</Label>
                    <div className="font-medium">10%</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Benefits</Label>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Earn 1.5x points</li>
                    <li>• 10% discount on all orders</li>
                    <li>• Free delivery</li>
                    <li>• Birthday gift</li>
                    <li>• VIP events</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Platinum Tier */}
            <Card className="border-2" style={{ borderColor: '#E5E4E2' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E5E4E220' }}>
                    <Crown className="w-6 h-6" style={{ color: '#E5E4E2' }} />
                  </div>
                  <div>
                    <CardTitle>Platinum Tier</CardTitle>
                    <CardDescription>3,000+ points</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Points Multiplier</Label>
                    <div className="font-medium">2.0x</div>
                  </div>
                  <div>
                    <Label className="text-xs">Tier Discount</Label>
                    <div className="font-medium">15%</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Benefits</Label>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Earn 2x points</li>
                    <li>• 15% discount on all orders</li>
                    <li>• Free delivery</li>
                    <li>• Concierge service</li>
                    <li>• Exclusive tasting events</li>
                    <li>• Personal recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reward Dialog */}
      <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReward ? 'Edit Reward' : 'Create New Reward'}
            </DialogTitle>
            <DialogDescription>
              Configure reward details and points cost
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rewardName">Reward Name *</Label>
              <Input
                id="rewardName"
                value={rewardForm.name}
                onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                placeholder="e.g., $5 Off Any Order"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewardDesc">Description *</Label>
              <Textarea
                id="rewardDesc"
                value={rewardForm.description}
                onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                placeholder="Describe the reward..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointsCost">Points Cost *</Label>
                <Input
                  id="pointsCost"
                  type="number"
                  min="0"
                  value={rewardForm.pointsCost}
                  onChange={(e) => setRewardForm({ ...rewardForm, pointsCost: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardType">Reward Type *</Label>
                <Select
                  value={rewardForm.rewardType}
                  onValueChange={(value: any) => setRewardForm({ ...rewardForm, rewardType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount-percentage">Percentage Discount</SelectItem>
                    <SelectItem value="discount-fixed">Fixed Discount</SelectItem>
                    <SelectItem value="free-item">Free Item</SelectItem>
                    <SelectItem value="special-offer">Special Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(rewardForm.rewardType === 'discount-percentage' || rewardForm.rewardType === 'discount-fixed') && (
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value {rewardForm.rewardType === 'discount-percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={rewardForm.rewardType === 'discount-percentage' ? '1' : '0.01'}
                  value={rewardForm.discountValue || 0}
                  onChange={(e) => setRewardForm({ ...rewardForm, discountValue: parseFloat(e.target.value) })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="minTier">Minimum Tier (Optional)</Label>
              <Select
                value={rewardForm.minTier || 'none'}
                onValueChange={(value) => setRewardForm({ ...rewardForm, minTier: value === 'none' ? undefined : value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Restriction</SelectItem>
                  <SelectItem value="bronze">Bronze+</SelectItem>
                  <SelectItem value="silver">Silver+</SelectItem>
                  <SelectItem value="gold">Gold+</SelectItem>
                  <SelectItem value="platinum">Platinum Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={rewardForm.isActive}
                onCheckedChange={(checked) => setRewardForm({ ...rewardForm, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRewardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReward}>
              {editingReward ? 'Update Reward' : 'Create Reward'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}