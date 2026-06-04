import { useDrawEngine } from "./useDrawEngine";
import DrawToolbar from "./DrawToolbar";
import DrawCanvas from "./DrawCanvas";

export default function DrawPage() {
  const engine = useDrawEngine();
  return (
    <main className="fixed inset-0 bg-[#111111] overflow-hidden select-none">
      <DrawToolbar engine={engine} />
      <div className="absolute inset-x-0 bottom-0 top-[54px]">
        <DrawCanvas engine={engine} />
      </div>
    </main>
  );
}
