import React from "react";

export default function Callout({ children }) {
  return (
    <div className="border-l-[3px] border-[var(--accent)] bg-[var(--accent)]/[0.07] rounded-r-lg px-5 py-4 my-7">
      <p className="text-[15px] text-white/85 leading-relaxed m-0">{children}</p>
    </div>
  );
}
