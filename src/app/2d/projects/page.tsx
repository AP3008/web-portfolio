import { TwoDLayout } from "@/components/2d/TwoDLayout";
import { ProjectsSection } from "@/components/2d/ProjectsSection";

export default function ProjectsPage() {
  return (
    <TwoDLayout backHref="/2d">
      <ProjectsSection />
    </TwoDLayout>
  );
}
