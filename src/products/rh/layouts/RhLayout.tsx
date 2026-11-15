import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RhSidebar } from "../components/RhSidebar";
import { RhHeader } from "../components/RhHeader";

export const RhLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#9D174D" }} data-testid="rh-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><RhSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><RhSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="rh-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <RhHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="rh-main"><Outlet /></main>
      </div>
    </div>
  );
};
