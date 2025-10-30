import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Input } from '../../../components/ui/input';
import {
  MapPin,
  Store,
  Warehouse,
  Building,
  Navigation,
  Check,
  Search,
  MapPinned,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Location {
  id: string;
  name: string;
  code: string;
  type: 'store' | 'warehouse' | 'pop-up' | 'mobile';
  status: 'active' | 'inactive' | 'pending';
  address: {
    city: string;
    state: string;
  };
}

interface LocationSelectorProps {
  currentLocation: Location | null;
  onLocationChange: (location: Location) => void;
  trigger?: React.ReactNode;
}

export function LocationSelector({ currentLocation, onLocationChange, trigger }: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock locations - would come from store in production
  const locations: Location[] = [
    {
      id: '1',
      name: 'Downtown Store',
      code: 'DT-001',
      type: 'store',
      status: 'active',
      address: { city: 'New York', state: 'NY' }
    },
    {
      id: '2',
      name: 'Westside Location',
      code: 'WS-002',
      type: 'store',
      status: 'active',
      address: { city: 'Los Angeles', state: 'CA' }
    },
    {
      id: '3',
      name: 'Central Warehouse',
      code: 'WH-003',
      type: 'warehouse',
      status: 'active',
      address: { city: 'Chicago', state: 'IL' }
    },
    {
      id: '4',
      name: 'Airport Pop-Up',
      code: 'AP-004',
      type: 'pop-up',
      status: 'active',
      address: { city: 'New York', state: 'NY' }
    }
  ];

  const filteredLocations = locations.filter(location =>
    location.status === 'active' &&
    (location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
     location.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeIcon = (type: Location['type']) => {
    const icons = {
      store: Store,
      warehouse: Warehouse,
      'pop-up': Building,
      mobile: Navigation
    };
    return icons[type] || Store;
  };

  const handleSelectLocation = (location: Location) => {
    onLocationChange(location);
    setOpen(false);
    toast.success(`Switched to ${location.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <MapPin className="w-4 h-4" />
            {currentLocation ? (
              <>
                {currentLocation.name}
                <Badge variant="secondary" className="ml-1">
                  {currentLocation.code}
                </Badge>
              </>
            ) : (
              'Select Location'
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Location</DialogTitle>
          <DialogDescription>
            Select which location you're operating from
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
              <p className="text-xs text-muted-foreground mb-2">Current Location</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {React.createElement(getTypeIcon(currentLocation.type), {
                    className: 'w-5 h-5 text-primary'
                  })}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{currentLocation.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLocation.address.city}, {currentLocation.address.state}
                  </p>
                </div>
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>
          )}

          {/* Location List */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Available Locations</p>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredLocations
                  .filter(loc => loc.id !== currentLocation?.id)
                  .map(location => {
                    const Icon = getTypeIcon(location.type);
                    return (
                      <button
                        key={location.id}
                        className="w-full p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-accent transition-colors text-left"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{location.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {location.code}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {location.address.city}, {location.address.state}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                {filteredLocations.filter(loc => loc.id !== currentLocation?.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPinned className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No other locations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
            <Clock className="w-3 h-3" />
            <span>Location changes are tracked in shift reports</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
