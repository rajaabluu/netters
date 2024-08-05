import { useState } from "react";

export default function useModal() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  return { show, toggle };
}
