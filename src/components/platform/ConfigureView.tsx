import { useState } from "react";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { IDESidebar, type SelectedItem } from "@/components/ide/IDESidebar";
import { CenterPanel } from "@/components/ide/CenterPanel";
import { MatrixCenterPanel } from "@/components/ide/MatrixCenterPanel";
import { RightPanel } from "@/components/ide/RightPanel";
import { MatrixRightPanel } from "@/components/ide/MatrixRightPanel";
import { TracePanel } from "@/components/ide/TracePanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export function ConfigureView() {
  const [selected, setSelected] = useState<SelectedItem>({ type: "rule", item: rules[0] });

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      {/* Left sidebar */}
      <ResizablePanel defaultSize={18} minSize={12} maxSize={28}>
        <IDESidebar selected={selected} onSelect={setSelected} />
      </ResizablePanel>
      <ResizableHandle />
      {/* Center + Bottom trace */}
      <ResizablePanel defaultSize={58} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={78} minSize={40}>
            {selected.type === "rule" ? (
              <CenterPanel rule={selected.item} />
            ) : (
              <MatrixCenterPanel matrix={selected.item} />
            )}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={22} minSize={8} collapsible>
            <TracePanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      {/* Right panel */}
      <ResizablePanel defaultSize={24} minSize={14} collapsible>
        {selected.type === "rule" ? (
          <RightPanel rule={selected.item} />
        ) : (
          <MatrixRightPanel matrix={selected.item} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
