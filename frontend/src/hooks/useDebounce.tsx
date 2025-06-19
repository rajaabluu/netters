import { useEffect, useState } from "react";

export default function useDebouncedVal<T>(value: T, delay: number) {
  const [debouncedVal, setDebouncedVal] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedVal;
}
