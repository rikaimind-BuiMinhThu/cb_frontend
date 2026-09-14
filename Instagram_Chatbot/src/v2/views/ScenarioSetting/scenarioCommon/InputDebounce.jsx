import { useEffect, useState } from "react";
import useDebounce from "v2/hooks/useDebounce";
import InputCustom from "./InputCustom";

const InputDebounce = ({
  value,
  onChange,
  debounceTime = 500,
  onCompositionStart,
  onCompositionEnd,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { debouncedValue, setInputValue, inputValue } = useDebounce(
    value,
    debounceTime,
    isComposing,
    isFocused,
  );

  const handleChange = (nextValue) => {
    setInputValue(nextValue);
  };

  const handleChangeEnd = (event) => {
    setIsComposing(false);
    setInputValue(event.target.value);
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  useEffect(() => {
    if (isComposing) {
      return;
    }
    onChange(debouncedValue);
    // Notify only when the settled value changes, not when the parent callback identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, isComposing]);

  return (
    <InputCustom
      {...props}
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onCompositionStart={() => {
        setIsComposing(true);
        if (onCompositionStart) {
          onCompositionStart();
        }
      }}
      onCompositionEnd={handleChangeEnd}
    />
  );
};

export default InputDebounce;
