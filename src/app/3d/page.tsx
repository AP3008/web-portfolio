import { DesktopGuard } from "@/components/gate/DesktopGuard";
import { DeskExperience } from "@/components/desk/DeskExperience";

export default function ThreeDPage() {
  return (
    <DesktopGuard>
      <DeskExperience />
    </DesktopGuard>
  );
}
