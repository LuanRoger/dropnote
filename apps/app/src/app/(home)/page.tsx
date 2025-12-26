import CenterSection from "./components/center-section";
import Header from "./components/header";
import SpecialRoutesSection from "./components/special-routes-section";

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
