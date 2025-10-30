import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Terminal } from '../lib/types';
import { mockUsers } from '../lib/mockData';
import { useStore } from '../lib/store';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onNavigateToAdmin?: () => void;
}

export function LoginScreen({ onLogin, onNavigateToAdmin }: LoginScreenProps) {
  const [userId, setUserId] = useState('2');
  const [pin, setPin] = useState('567890');
  const [error, setError] = useState('');
  const [showShiftStart, setShowShiftStart] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('100.00');
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  
  const startShift = useStore(state => state.startShift);

  const handleLogin = () => {
    const user = mockUsers.find(u => u.id === userId && u.pin === pin);
    
    if (user) {
      setPendingUser(user);
      // Set default terminal
      if (user.terminals.length > 0) {
        setSelectedTerminal(user.terminals[0]);
      }
      setShowShiftStart(true);
      setError('');
    } else {
      setError('Invalid User ID or PIN');
    }
  };

  const handleStartShift = () => {
    if (pendingUser && selectedTerminal && openingBalance) {
      const balance = parseFloat(openingBalance);
      if (!isNaN(balance) && balance >= 0) {
        startShift(pendingUser.id, selectedTerminal, balance);
        
        // Show screen resolution for debugging
        // Clock in successful - start shift
        onLogin(pendingUser);
        setShowShiftStart(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">AuraFlow POS Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="bg-input-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="bg-input-background"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          {onNavigateToAdmin && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
          )}

          {onNavigateToAdmin && (
            <Button
              variant="outline"
              onClick={onNavigateToAdmin}
              className="w-full"
            >
              Admin Login
            </Button>
          )}

          <div className="text-sm text-muted-foreground mt-4">
            <p>Demo credentials:</p>
            <p>Admin: ID=1, PIN=123456</p>
            <p>Staff: ID=2, PIN=567890</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showShiftStart} onOpenChange={setShowShiftStart}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clock In</DialogTitle>
            <DialogDescription>
              Select a terminal and enter the opening cash balance to clock in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pendingUser && pendingUser.terminals.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="terminal">Terminal</Label>
                <Select
                  value={selectedTerminal?.id}
                  onValueChange={(value) => {
                    const terminal = pendingUser.terminals.find(t => t.id === value);
                    if (terminal) setSelectedTerminal(terminal);
                  }}
                >
                  <SelectTrigger id="terminal" className="bg-input-background">
                    <SelectValue placeholder="Select a terminal" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingUser.terminals.map((terminal) => (
                      <SelectItem key={terminal.id} value={terminal.id}>
                        {terminal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="openingBalance">Opening Cash Balance ($)</Label>
              <Input
                id="openingBalance"
                type="number"
                step="0.01"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0.00"
                className="bg-input-background"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Count the cash in the drawer and enter the total amount.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleStartShift}
              disabled={!selectedTerminal || !openingBalance}
            >
              Clock In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}