import { useState } from "react";

export default function useModal() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  const open = () => setShow(true);
  const close = () => setShow(false);
  return { show, toggle, open, close };
}
