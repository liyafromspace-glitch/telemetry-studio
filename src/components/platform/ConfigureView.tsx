import { useState } from "react";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { IDESidebar, type SelectedItem } from "@/components/ide/IDESidebar";
import { CenterPanel } from "@/components/ide/CenterPanel";
import { MatrixCenterPanel } from "@/components/ide/MatrixCenterPanel";
import { RightPanel } from "@/components/ide/RightPanel";
import { MatrixRightPanel } from "@/components/ide/MatrixRightPanel";

export function ConfigureView() {
  const [selected, setSelected] = useState<SelectedItem>({ type: "rule", item: rules[0] });

  return (
    <div className="flex-1 flex min-h-0">
      <IDESidebar selected={selected} onSelect={setSelected} />
      {selected.type === "rule" ? (
        <>
          <CenterPanel rule={selected.item} />
          <RightPanel rule={selected.item} />
        </>
      ) : (
        <>
          <MatrixCenterPanel matrix={selected.item} />
          <MatrixRightPanel matrix={selected.item} />
        </>
      )}
    </div>
  );
}
