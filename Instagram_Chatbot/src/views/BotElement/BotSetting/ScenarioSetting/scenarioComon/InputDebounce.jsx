import useDebounce from "hook/useDebounce";
import { useEffect } from "react";
import InputCustom from "./InputCustom";

export default function InputDebounce({ value, onChange, debounceTime = 500, ...props }) {
  const { debouncedValue, setInputValue, inputValue } = useDebounce(value, debounceTime);

  const handleChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <InputCustom
      {...props}
      value={value || inputValue}
      onChange={handleChange}
    />
  );  
}