import clsx from "clsx";
import { useState } from "react";

export default function HomePage() {
  const [type, setType] = useState<"all" | "following">("all");

  return (
    <div>
      <div className="flex *:w-1/2 text-center py-4 sm:py-5 text-neutral-600 border-b border-b-slate-300 sticky top-0 *:cursor-pointer max-md:text-sm">
        <span onClick={() => setType("all")}>For You</span>
        <span onClick={() => setType("following")}>Following</span>
        <span
          className={clsx(
            "absolute px-14 sm:px-20 bottom-0 duration-300 ease-in-out transition-all",
            type == "following" && "translate-x-full"
          )}
        >
          <div className="bg-black py-[0.1rem] sm:py-[0.10rem] rounded-full w-full"></div>
        </span>
      </div>
    </div>
  );
}
