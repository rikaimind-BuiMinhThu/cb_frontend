import useDebounce from "v2/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import InputCustom from "./InputCustom";
const InputDebounce = ({ value, onChange, debounceTime = 500, onCompositionStart, onCompositionEnd, ...props}) => {
  const [ isComposing, setIsComposing ] = useState (false)
  const { debouncedValue, setInputValue, inputValue } = useDebounce(value, debounceTime, isComposing);
  // Callers pass a new onChange on every render. As an effect dependency it re-ran the
  // effect after every render, and the resulting state update froze the chat.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;


  const handleChange = (value) => {
    setInputValue(value);
      };

  const handleChangeEnd = (e) => {
    setIsComposing(false);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if(!isComposing) {
      onChangeRef.current(debouncedValue)
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

export default InputDebounce;