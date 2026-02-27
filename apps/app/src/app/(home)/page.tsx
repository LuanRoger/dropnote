import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import CenterSection from "./components/center-section";
import Header from "./components/header";
import SpecialRoutesSection from "./components/special-routes-section";

export const generateMetadata = async (): Promise<Metadata> =>
  createMetadata({
    description:
      "The fastest way to take notes and share text online. No login required, AI-powered, and open-source.",
  });

export default function Home() {
  return (
    <main className="relative h-screen w-screen p-4">
      <Header />
      <CenterSection />
      <div className="absolute inset-x-4 bottom-4 flex flex-row">
        <SpecialRoutesSection />
      </div>
    </main>
  );
}
