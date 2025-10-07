import useDebounce from "hook/useDebounce";
import { useEffect, useState } from "react";
import InputCustom from "./InputCustom";
export default function InputDebounce({ value, onChange, debounceTime = 500, onCompositionStart, onCompositionEnd, ...props}) {
  const { debouncedValue, setInputValue, inputValue } = useDebounce(value, debounceTime);
  const [ isComposing, setIsComposing ] = useState (false)

  const handleChange = (value) => {
    setInputValue(value);
      };

  const handleChangeEnd = (e) => {
    setIsComposing(false);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if(!isComposing) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, isComposing]);

  return (
    <InputCustom
      {...props}
      value={inputValue}
      onChange={handleChange}
      onCompositionStart = {() => setIsComposing(true)}
      onCompositionEnd ={handleChangeEnd}
    />
  );  
}