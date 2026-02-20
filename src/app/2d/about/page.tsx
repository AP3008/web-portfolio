import { TwoDLayout } from "@/components/2d/TwoDLayout";
import { AboutSection } from "@/components/2d/AboutSection";

export default function AboutPage() {
  return (
    <TwoDLayout backHref="/2d">
      <AboutSection />
    </TwoDLayout>
  );
}
