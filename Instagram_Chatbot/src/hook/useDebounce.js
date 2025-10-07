import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    setInputValue(value)
  }, [value]);

  useEffect(() => {
    if (!inputValue) {
      setDebouncedValue(inputValue);
      return;
    };
    
    const handler = setTimeout(() => setDebouncedValue(inputValue), delay);
    return () => clearTimeout(handler);
  }, [inputValue, delay]);

  return {debouncedValue, setInputValue, inputValue};
}