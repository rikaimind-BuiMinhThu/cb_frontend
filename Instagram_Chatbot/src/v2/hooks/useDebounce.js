import { useEffect, useState } from 'react';

const useDebounce = (value, delay, isComposing = false) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!inputValue || isComposing) {
      setDebouncedValue(inputValue);
      return undefined;
    }

    const handler = setTimeout(() => setDebouncedValue(inputValue), delay);
    return () => clearTimeout(handler);
  }, [inputValue, delay, isComposing]);

  return { debouncedValue, setInputValue, inputValue };
};

export default useDebounce;
