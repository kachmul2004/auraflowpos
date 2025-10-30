import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AnimatedButton } from '../animated/AnimatedButton';
import { AnimatedCard } from '../animated/AnimatedCard';
import { SuccessAnimation, SuccessCheckmark } from '../animated/SuccessAnimation';
import { ErrorAnimation, ShakeContainer, ErrorX } from '../animated/ErrorAnimation';
import { LoadingSpinner, SkeletonLoader } from '../animated/LoadingSpinner';
import { AnimatedNumber, AnimatedCurrency, AnimatedPercentage, AnimatedCounter } from '../animated/AnimatedNumber';
import { AnimatedBadge, NotificationBadge } from '../animated/AnimatedBadge';
import { AnimatedList, AnimatedListItem } from '../animated/AnimatedList';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Trash, 
  Edit, 
  Save, 
  Bell, 
  ShoppingCart,
  Heart,
  Star,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AnimationShowcase() {
  const [counter, setCounter] = useState(42);
  const [revenue, setRevenue] = useState(1234.56);
  const [percentage, setPercentage] = useState(67.5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [notifications, setNotifications] = useState(5);

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    toast.success('Action completed successfully!');
  };

  const triggerError = () => {
    setShowError(true);
    setShakeInput(true);
    setTimeout(() => setShowError(false), 2000);
    toast.error('Something went wrong!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Animation Showcase</h1>
        <p className="text-muted-foreground">
          Preview all micro-interactions and animations in AuraFlow POS
        </p>
      </div>

      <Tabs defaultValue="buttons">
        <TabsList>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="numbers">Numbers</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="lists">Lists</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Button Animations</CardTitle>
              <CardDescription>Hover and click to see animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Buttons */}
              <div>
                <h3 className="text-sm font-medium mb-3">Standard Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <AnimatedButton variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </AnimatedButton>
                  <AnimatedButton variant="destructive">
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </AnimatedButton>
                  <AnimatedButton variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </AnimatedButton>
                  <AnimatedButton variant="secondary">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </AnimatedButton>
                  <AnimatedButton variant="ghost">Cancel</AnimatedButton>
                </div>
              </div>

              {/* Icon Buttons */}
              <div>
                <h3 className="text-sm font-medium mb-3">Icon Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <AnimatedButton variant="outline" size="icon" animationVariant="icon">
                    <Heart className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="icon" animationVariant="icon">
                    <Star className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="icon" animationVariant="icon">
                    <ShoppingCart className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="icon" animationVariant="icon">
                    <Bell className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </div>

              {/* Disabled State */}
              <div>
                <h3 className="text-sm font-medium mb-3">Disabled State</h3>
                <div className="flex flex-wrap gap-3">
                  <AnimatedButton disabled>Disabled Button</AnimatedButton>
                  <AnimatedButton variant="outline" disabled>
                    Disabled Outline
                  </AnimatedButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Animations */}
          <Card>
            <CardHeader>
              <CardTitle>Card Animations</CardTitle>
              <CardDescription>Hover over cards to see lift effect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <AnimatedCard enableHover enableTap onClick={() => toast.info('Card clicked!')}>
                  <CardHeader>
                    <CardTitle className="text-base">Interactive Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click me to see tap animation
                    </p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard enableHover>
                  <CardHeader>
                    <CardTitle className="text-base">Hover Only</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover to see lift effect
                    </p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard>
                  <CardHeader>
                    <CardTitle className="text-base">No Animation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Static card for comparison
                    </p>
                  </CardContent>
                </AnimatedCard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Animations</CardTitle>
              <CardDescription>Positive feedback indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Success States</h3>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="text-center">
                    <AnimatedButton onClick={triggerSuccess}>
                      Trigger Success
                    </AnimatedButton>
                  </div>
                  
                  {showSuccess && (
                    <SuccessAnimation size={80} />
                  )}

                  <div className="flex items-center gap-2">
                    <SuccessCheckmark size={20} />
                    <span className="text-sm">Inline checkmark</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Animations</CardTitle>
              <CardDescription>Error feedback and shake effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Error States</h3>
                <div className="flex flex-wrap gap-8 items-center">
                  <AnimatedButton variant="destructive" onClick={triggerError}>
                    Trigger Error
                  </AnimatedButton>
                  
                  {showError && (
                    <ErrorAnimation size={80} trigger={showError} />
                  )}

                  <div className="flex items-center gap-2">
                    <ErrorX size={20} />
                    <span className="text-sm">Inline error X</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Shake Animation (Form Validation)</h3>
                <ShakeContainer trigger={shakeInput}>
                  <Input 
                    placeholder="This input will shake on error"
                    className={shakeInput ? 'border-red-500' : ''}
                  />
                </ShakeContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loading Tab */}
        <TabsContent value="loading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading Indicators</CardTitle>
              <CardDescription>Various loading states and spinners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Spinner Variants</h3>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="spinner" size={32} />
                    <p className="text-xs text-muted-foreground">Spinner</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="dots" />
                    <p className="text-xs text-muted-foreground">Dots</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="pulse" size={32} />
                    <p className="text-xs text-muted-foreground">Pulse</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Skeleton Loaders</h3>
                <div className="space-y-3">
                  <SkeletonLoader height="60px" />
                  <SkeletonLoader height="40px" width="80%" />
                  <SkeletonLoader height="40px" width="60%" />
                  <div className="flex gap-3">
                    <SkeletonLoader height="100px" width="100px" />
                    <div className="flex-1 space-y-2">
                      <SkeletonLoader height="20px" />
                      <SkeletonLoader height="20px" width="80%" />
                      <SkeletonLoader height="20px" width="60%" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Numbers Tab */}
        <TabsContent value="numbers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animated Numbers</CardTitle>
              <CardDescription>Smooth number transitions and counters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Counter</h3>
                <div className="flex items-center gap-4">
                  <AnimatedButton onClick={() => setCounter(counter - 1)} variant="outline" size="sm">
                    -1
                  </AnimatedButton>
                  <div className="text-4xl font-bold">
                    <AnimatedCounter value={counter} />
                  </div>
                  <AnimatedButton onClick={() => setCounter(counter + 1)} variant="outline" size="sm">
                    +1
                  </AnimatedButton>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Currency</h3>
                <div className="flex items-center gap-4">
                  <AnimatedButton onClick={() => setRevenue(revenue - 100)} variant="outline" size="sm">
                    -$100
                  </AnimatedButton>
                  <div className="text-4xl font-bold text-green-600">
                    <AnimatedCurrency value={revenue} />
                  </div>
                  <AnimatedButton onClick={() => setRevenue(revenue + 100)} variant="outline" size="sm">
                    +$100
                  </AnimatedButton>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Percentage</h3>
                <div className="flex items-center gap-4">
                  <AnimatedButton onClick={() => setPercentage(percentage - 10)} variant="outline" size="sm">
                    -10%
                  </AnimatedButton>
                  <div className="text-4xl font-bold text-blue-600">
                    <AnimatedPercentage value={percentage} />
                  </div>
                  <AnimatedButton onClick={() => setPercentage(percentage + 10)} variant="outline" size="sm">
                    +10%
                  </AnimatedButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animated Badges</CardTitle>
              <CardDescription>Badge animations and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Badge Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <AnimatedBadge>Default</AnimatedBadge>
                  <AnimatedBadge variant="secondary">Secondary</AnimatedBadge>
                  <AnimatedBadge variant="destructive">Destructive</AnimatedBadge>
                  <AnimatedBadge variant="outline">Outline</AnimatedBadge>
                  <AnimatedBadge pulse>Pulsing</AnimatedBadge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Notification Badges</h3>
                <div className="flex flex-wrap gap-8">
                  <div className="relative inline-block">
                    <AnimatedButton variant="outline" size="icon">
                      <Bell className="w-4 h-4" />
                    </AnimatedButton>
                    <NotificationBadge count={notifications} />
                  </div>

                  <div className="relative inline-block">
                    <AnimatedButton variant="outline" size="icon">
                      <ShoppingCart className="w-4 h-4" />
                    </AnimatedButton>
                    <NotificationBadge count={12} />
                  </div>

                  <div className="space-x-2">
                    <AnimatedButton onClick={() => setNotifications(notifications + 1)} size="sm">
                      +1
                    </AnimatedButton>
                    <AnimatedButton onClick={() => setNotifications(Math.max(0, notifications - 1))} size="sm">
                      -1
                    </AnimatedButton>
                    <AnimatedButton onClick={() => setNotifications(0)} variant="outline" size="sm">
                      Clear
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lists Tab */}
        <TabsContent value="lists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animated Lists</CardTitle>
              <CardDescription>Staggered list animations</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedList>
                {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'].map((item, index) => (
                  <AnimatedListItem key={index}>
                    <div className="p-4 border border-border rounded-lg mb-2 hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item}</span>
                        <Badge variant="secondary">{index + 1}</Badge>
                      </div>
                    </div>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
