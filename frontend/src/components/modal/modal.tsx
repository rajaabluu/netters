import clsx from "clsx";
import { ReactNode } from "react";

export default function Modal({
  show,
  toggle,
  children,
}: {
  show: boolean;
  toggle: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <div
        onClick={toggle}
        className={clsx(
          "fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.2)] z-[9998] px-6 sm:px-8 flex justify-center items-center duration-300 ease-in-out",
          show ? "opacity-100" : " pointer-events-none opacity-0"
        )}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={clsx(
            "z-[9999] duration-300 ease-in-out",
            show
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
