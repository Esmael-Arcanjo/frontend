import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BioQrCard = ({ url, handle, locked }: { url: string; handle: string; locked?: boolean }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const download = () => {
    const canvas = wrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qrcode-${handle}.png`;
    a.click();
  };
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row" data-testid="bio-qr-card">
      <div ref={wrap} className="rounded-lg bg-white p-3" data-testid="bio-qr-code">
        <QRCodeCanvas value={url} size={512} level="M" marginSize={1} style={{ width: 132, height: 132 }} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="font-display text-base font-bold">QR code da sua página</h2>
        <p className="mt-1 text-sm text-muted-foreground">Imprima em cartões de visita, vitrines e embalagens. Quem escanear abre sua página na hora.</p>
        {locked ? (
          <div className="mt-4 space-y-2" data-testid="bio-qr-locked">
            <Button className="rounded-full" disabled data-testid="bio-qr-download"><Download className="mr-1 h-4 w-4" /> Baixar PNG</Button>
            <p className="text-xs text-muted-foreground">Download disponível nos planos pagos. <a href="/contratar/link-bio" className="font-semibold underline">Fazer upgrade</a></p>
          </div>
        ) : <Button className="mt-4 rounded-full" onClick={download} data-testid="bio-qr-download"><Download className="mr-1 h-4 w-4" /> Baixar PNG</Button>}
      </div>
    </div>
  );
};
