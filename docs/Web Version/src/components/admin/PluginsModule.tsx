import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Package, 
  CheckCircle, 
  Lock, 
  Settings,
  TrendingUp,
  Info
} from 'lucide-react';
import { usePlugins } from '../../core/hooks/usePlugins';
import { useStore } from '../../lib/store';
import { Plugin } from '../../core/lib/types/plugin.types';
import { PACKAGES } from '../../config/plugins.config';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function PluginsModule() {
  const { getActivePlugins, isActive } = usePlugins();
  const currentUser = useStore(state => state.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [showPluginDetails, setShowPluginDetails] = useState(false);
  
  const currentPackage = currentUser?.package || 'free';
  const activePlugins = getActivePlugins();
  
  // Get current package details
  const packageDetails = PACKAGES.find(p => p.id === currentPackage);
  const availablePluginIds = packageDetails?.plugins || [];
  
  // Get all plugins from registry (we'll need to import this)
  const allPlugins = activePlugins; // For now, just show active plugins
  
  // Filter plugins
  const filteredPlugins = allPlugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Group plugins by category
  const categories = [
    { id: 'all', label: 'All Plugins', count: allPlugins.length },
    { id: 'restaurant', label: 'Restaurant', count: allPlugins.filter(p => p.category === 'restaurant').length },
    { id: 'retail', label: 'Retail', count: allPlugins.filter(p => p.category === 'retail').length },
    { id: 'healthcare', label: 'Healthcare', count: allPlugins.filter(p => p.category === 'healthcare').length },
    { id: 'services', label: 'Services', count: allPlugins.filter(p => p.category === 'services').length },
  ];
  
  const handlePluginToggle = (plugin: Plugin) => {
    // Check if user has access to this plugin
    const hasAccess = availablePluginIds.includes(plugin.id);
    
    if (!hasAccess) {
      toast.error(`This plugin requires the ${plugin.tier.toUpperCase()} package or higher`);
      return;
    }
    
    // Toggle plugin (this would be implemented in plugin manager)
    if (isActive(plugin.id)) {
      toast.success(`${plugin.name} disabled`);
      // pluginManager.deactivatePlugin(plugin.id);
    } else {
      toast.success(`${plugin.name} enabled`);
      // pluginManager.activatePlugin(plugin.id);
    }
  };
  
  const handleViewDetails = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setShowPluginDetails(true);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🍽️';
      case 'retail': return '🏪';
      case 'healthcare': return '💊';
      case 'services': return '💼';
      default: return '📦';
    }
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'starter': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'professional': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      case 'ultimate': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Plugin Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your installed plugins and discover new features
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-2">
            <Package className="w-4 h-4 mr-2" />
            {activePlugins.length} Active Plugin{activePlugins.length !== 1 ? 's' : ''}
          </Badge>
          <Badge className={getTierColor(currentPackage)}>
            {currentPackage.toUpperCase()} Package
          </Badge>
        </div>
      </div>
      
      {/* Current Package Info */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Current Package
          </CardTitle>
          <CardDescription>
            {packageDetails?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Package Tier</p>
              <p className="text-2xl font-bold">{currentPackage.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Plugins</p>
              <p className="text-2xl font-bold">{availablePluginIds.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
              <p className="text-2xl font-bold">
                {currentPackage === 'free' ? 'Free' : 
                 currentPackage === 'starter' ? '$49' : 
                 currentPackage === 'professional' ? '$99' : '$199'}
              </p>
            </div>
          </div>
        </CardContent>
        {currentPackage !== 'ultimate' && (
          <CardFooter>
            <Button className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Package to Unlock More Plugins
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Separator />
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.label}
              {cat.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {cat.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Plugin Grid */}
      {filteredPlugins.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No plugins match your search' : 'No plugins available in this category'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlugins.map(plugin => {
            const active = isActive(plugin.id);
            const hasAccess = availablePluginIds.includes(plugin.id);
            
            return (
              <Card key={plugin.id} className={active ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(plugin.category)}</span>
                      <div>
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <CardDescription className="text-xs">v{plugin.version}</CardDescription>
                      </div>
                    </div>
                    {active && (
                      <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plugin.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {plugin.category}
                    </Badge>
                    <Badge className={`text-xs ${getTierColor(plugin.tier)}`}>
                      {plugin.tier.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {!hasAccess && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                      <Lock className="w-3 h-3" />
                      <span>Requires {plugin.tier.toUpperCase()} package</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(plugin)}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  {hasAccess ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={active}
                        onCheckedChange={() => handlePluginToggle(plugin)}
                      />
                      <span className="text-sm">{active ? 'On' : 'Off'}</span>
                    </div>
                  ) : (
                    <Button size="sm" className="flex-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Upgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Plugin Details Dialog */}
      {selectedPlugin && (
        <Dialog open={showPluginDetails} onOpenChange={setShowPluginDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(selectedPlugin.category)}</span>
                {selectedPlugin.name}
              </DialogTitle>
              <DialogDescription>
                Version {selectedPlugin.version} • {selectedPlugin.category} plugin
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPlugin.description}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Package Requirement</h3>
                <Badge className={getTierColor(selectedPlugin.tier)}>
                  {selectedPlugin.tier.toUpperCase()} Package or Higher
                </Badge>
              </div>
              
              {selectedPlugin.dependencies && selectedPlugin.dependencies.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Dependencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlugin.dependencies.map(dep => (
                        <Badge key={dep} variant="outline">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {selectedPlugin.recommendedFor && selectedPlugin.recommendedFor.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recommended For</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlugin.recommendedFor.map(rec => (
                        <Badge key={rec} variant="secondary">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowPluginDetails(false)}>
                Close
              </Button>
              {availablePluginIds.includes(selectedPlugin.id) ? (
                <Button className="flex-1" onClick={() => {
                  handlePluginToggle(selectedPlugin);
                  setShowPluginDetails(false);
                }}>
                  {isActive(selectedPlugin.id) ? 'Disable' : 'Enable'} Plugin
                </Button>
              ) : (
                <Button className="flex-1">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade to {selectedPlugin.tier.toUpperCase()}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}