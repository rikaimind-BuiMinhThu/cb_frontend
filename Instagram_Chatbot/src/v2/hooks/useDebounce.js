import { useEffect, useState } from 'react';

const useDebounce = (value, delay, isComposing = false, skipValueSync = false) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    if (skipValueSync || isComposing) {
      return;
    }
    setInputValue(value);
  }, [value, skipValueSync, isComposing]);

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
