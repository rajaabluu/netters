import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
  position?: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export default function Popover({
  position = "bottom-left",
  open,
  onClose,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClose(e: MouseEvent) {
      if (
        !ref.current?.contains(e.target as Node) &&
        !ref.current?.parentNode?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    window.addEventListener("click", handleClose);

    return () => window.removeEventListener("click", handleClose);
  }, []);

  return (
    !!open && (
      <div
        ref={ref}
        className={clsx(
          "*:py-2 *:px-3.5 hover:*:bg-slate-50 *:cursor-pointer rounded-md absolute bg-white shadow border border-slate-50 text-sm text-slate-700",
          {
            "right-8 top-0": position === "bottom-left",
          }
        )}
        onClick={(e) => e.stopPropagation()} // Mencegah event klik menyebar
      >
        {children}
      </div>
    )
  );
}
