import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Calendar, AlertCircle, CheckCircle2, XCircle, Scan, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AgeVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: (verified: boolean, customerInfo?: CustomerInfo) => void;
  minimumAge?: number;
  requireManagerOverride?: boolean;
}

interface CustomerInfo {
  dateOfBirth: string;
  age: number;
  idType?: string;
  idNumber?: string;
  verified: boolean;
  verifiedAt: string;
  verifiedBy?: string;
}

export function AgeVerificationDialog({
  open,
  onOpenChange,
  onVerified,
  minimumAge = 21,
  requireManagerOverride = false,
}: AgeVerificationDialogProps) {
  const [verificationMethod, setVerificationMethod] = useState<'manual' | 'scan'>('manual');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerify = () => {
    if (!dateOfBirth) {
      toast.error('Please enter date of birth');
      return;
    }

    setIsVerifying(true);

    const age = calculateAge(dateOfBirth);
    const isOfAge = age >= minimumAge;

    const customerInfo: CustomerInfo = {
      dateOfBirth,
      age,
      idType,
      idNumber: idNumber ? `***${idNumber.slice(-4)}` : undefined, // Mask ID number
      verified: isOfAge,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Current User', // TODO: Get from auth context
    };

    setTimeout(() => {
      setIsVerifying(false);

      if (isOfAge) {
        toast.success('Age verified successfully', {
          description: `Customer is ${age} years old`,
        });
        onVerified(true, customerInfo);
        handleReset();
      } else {
        toast.error('Age verification failed', {
          description: `Customer must be ${minimumAge} or older`,
        });
        onVerified(false, customerInfo);
        handleReset();
      }
    }, 500);
  };

  const handleScanID = () => {
    // Placeholder for ID scanning functionality
    toast.info('ID Scanner', {
      description: 'Connect an ID scanner to automatically verify age',
    });
  };

  const handleReset = () => {
    setDateOfBirth('');
    setIdType('');
    setIdNumber('');
    setVerificationMethod('manual');
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription>
            Customer must be {minimumAge}+ to purchase age-restricted items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verification Method Toggle */}
          <div className="flex gap-2">
            <Button
              variant={verificationMethod === 'manual' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setVerificationMethod('manual')}
            >
              <User className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
            <Button
              variant={verificationMethod === 'scan' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setVerificationMethod('scan')}
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan ID
            </Button>
          </div>

          {verificationMethod === 'manual' ? (
            <>
              {/* Manual Entry Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth *
                  </Label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {dateOfBirth && (
                    <p className="text-sm text-muted-foreground">
                      Age: {calculateAge(dateOfBirth)} years old
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Type</Label>
                    <Input
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      placeholder="Driver's License"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last 4 of ID</Label>
                    <Input
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value.slice(0, 4))}
                      placeholder="1234"
                      maxLength={4}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Verify the customer's valid government-issued ID before proceeding. 
                  It is your responsibility to refuse service to anyone under {minimumAge}.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              {/* ID Scanner View */}
              <div className="py-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scan className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Scan Customer ID</p>
                  <p className="text-sm text-muted-foreground">
                    Place the ID card in the scanner
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleScanID}
                  className="w-full"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Test Scanner Connection
                </Button>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  ID scanner hardware required. Contact support for compatible scanner models.
                </AlertDescription>
              </Alert>
            </>
          )}

          {requireManagerOverride && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Manager override required for age verification
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel Sale
          </Button>
          {verificationMethod === 'manual' && (
            <Button
              onClick={handleVerify}
              disabled={!dateOfBirth || isVerifying}
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify Age
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
