import { Button } from './ui/button';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  allowDecimal?: boolean;
}

export function NumericKeypad({ 
  value, 
  onChange, 
  onClear,
  allowDecimal = true 
}: NumericKeypadProps) {
  const handleNumber = (num: string) => {
    onChange(value + num);
  };
  
  const handleDecimal = () => {
    if (allowDecimal && !value.includes('.')) {
      onChange(value + '.');
    }
  };
  
  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };
  
  const handleClear = () => {
    onChange('');
    onClear?.();
  };
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="outline"
          onClick={() => handleNumber(num.toString())}
          className="h-12 text-lg"
        >
          {num}
        </Button>
      ))}
      
      <Button
        variant="outline"
        onClick={handleClear}
        className="h-12 text-destructive"
      >
        C
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleNumber('0')}
        className="h-12 text-lg"
      >
        0
      </Button>
      
      {allowDecimal ? (
        <Button
          variant="outline"
          onClick={handleDecimal}
          className="h-12 text-lg"
          disabled={value.includes('.')}
        >
          .
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleBackspace}
          className="h-12"
        >
          <Delete className="w-5 h-5" />
        </Button>
      )}
      
      {allowDecimal && (
        <Button
          variant="outline"
          onClick={handleBackspace}
          className="h-12 col-span-3"
        >
          <Delete className="w-5 h-5 mr-2" />
          Backspace
        </Button>
      )}
    </div>
  );
}
