import React from "react";
import { useDrawEngine } from "./useDrawEngine";
import DrawToolbar from "./DrawToolbar";
import DrawCanvas from "./DrawCanvas";
import { useSeo } from "@/lib/seo";

export default function DrawPage() {
  useSeo({
    title: "Draw",
    description: "A canvas drawing tool built by Ankit Bhardwaj — sketch, doodle, and export right in the browser.",
    path: "/draw",
  });
  const engine = useDrawEngine();
  return (
    <main className="fixed inset-0 bg-[var(--bg)] overflow-hidden select-none">
      <DrawToolbar engine={engine} />
      <div className="absolute inset-x-0 bottom-0 top-[54px]">
        <DrawCanvas engine={engine} />
      </div>
    </main>
  );
}
