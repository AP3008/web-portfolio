"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";
import { ProjectPortalModal } from "./ProjectPortalModal";
import { ResumeModal } from "./ResumeModal";
import { AboutModal } from "./AboutModal";
import { ChessModal } from "./ChessModal";
import { FitnessModal } from "./FitnessModal";

export function ModalManager() {
  const activeModal = usePortfolioStore((s) => s.activeModal);
  const closeModal = usePortfolioStore((s) => s.closeModal);

  if (!activeModal) return null;

  switch (activeModal) {
    case "projects":
      return <ProjectPortalModal onClose={closeModal} />;
    case "resume":
      return <ResumeModal onClose={closeModal} />;
    case "about":
      return <AboutModal onClose={closeModal} />;
    case "chess":
      return <ChessModal onClose={closeModal} />;
    case "fitness":
      return <FitnessModal onClose={closeModal} />;
    default:
      return null;
  }
}
