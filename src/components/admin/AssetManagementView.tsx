import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AssetTree } from "./AssetTree";
import { AssetGraph } from "./AssetGraph";
import { AssetInspector } from "./AssetInspector";
import { AssetBottomTabs } from "./AssetBottomTabs";
import { AssetContextHeader } from "./AssetContextHeader";

export function AssetManagementView() {
  const [selectedId, setSelectedId] = useState<string | null>("eq-pump-4");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <AssetContextHeader selectedId={selectedId} onSelect={setSelectedId} />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={14} maxSize={30}>
          <AssetTree selectedId={selectedId} onSelect={setSelectedId} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={56} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={40}>
              <AssetGraph selectedId={selectedId} onSelect={setSelectedId} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={12} collapsible>
              <AssetBottomTabs selectedId={selectedId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={24} minSize={16} collapsible>
          <AssetInspector selectedId={selectedId} onSelect={setSelectedId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
