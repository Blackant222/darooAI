'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectChipProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectChip({ options, selected, onChange, placeholder }: MultiSelectChipProps) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const toggleSelection = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = () => {
    if (inputValue.trim() && !selected.includes(inputValue.trim())) {
      onChange([...selected, inputValue.trim()]);
      setInputValue('');
    }
    setShowInput(false);
  };
  
  const handleRemove = (option: string) => {
      onChange(selected.filter(item => item !== option));
  };


  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <Badge
            key={option}
            variant={selected.includes(option) ? 'default' : 'secondary'}
            onClick={() => toggleSelection(option)}
            className="cursor-pointer"
          >
            {option}
          </Badge>
        ))}
         <Badge
            variant={'outline'}
            onClick={() => setShowInput(prev => !prev)}
            className="cursor-pointer"
        >
            <Plus className='w-3 h-3 ml-1' />
            دیگر
        </Badge>
      </div>

       {showInput && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-grow"
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustom();
                }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddCustom}>افزودن</Button>
        </div>
      )}

      {selected.length > 0 && (
         <div className="flex flex-wrap gap-2 pt-2 border-t mt-4">
            {selected.map(item => {
                 const isPredefined = options.includes(item);
                 return (
                    <Badge key={item} variant={'default'} className='bg-primary/20 text-primary-foreground hover:bg-primary/30'>
                        {item}
                        <button onClick={() => handleRemove(item)} className='mr-2 p-0.5 rounded-full hover:bg-black/20'>
                            <X className='w-3 h-3' />
                        </button>
                    </Badge>
                 )
            })}
        </div>
      )}
    </div>
  );
}
