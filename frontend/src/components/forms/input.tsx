import clsx from "clsx";
import { KeyboardEvent, ReactNode } from "react";

export default function Input({
  onChange,
  placeholder,
  onKeyDown,
  name,
  value,
  className,
  children,
  type,
}: {
  onChange: (e: any) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
  className?: string;
  value: string;
  type: any;
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      <input
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        type={type}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border border-slate-300",
          className
        )}
      />
      {children}
    </div>
  );
}
