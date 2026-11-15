import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";

const resize = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const size = 400;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const s = Math.min(img.width, img.height);
    ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    resolve(canvas.toDataURL("image/jpeg", 0.85));
    URL.revokeObjectURL(img.src);
  };
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

type Props = { avatar: string | null; onUpload: (dataUrl: string) => Promise<void>; onRemove: () => Promise<void> };

export const AvatarUploader = ({ avatar, onUpload, onRemove }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast.error("Use uma imagem PNG, JPEG ou WEBP");
    try { await onUpload(await resize(file)); toast.success("Foto atualizada"); } catch (err) { toast.error(errMsg(err)); }
  };
  return (
    <div className="flex items-center gap-4" data-testid="bio-avatar-uploader">
      <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-muted">
        {avatar ? <img src={avatar} alt="Foto" className="h-full w-full object-cover" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={pick} data-testid="bio-avatar-input" />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()} data-testid="bio-avatar-upload"><Upload className="mr-1 h-4 w-4" /> Enviar foto</Button>
        {avatar && <Button type="button" variant="ghost" size="sm" onClick={() => onRemove().catch((e) => toast.error(errMsg(e)))} data-testid="bio-avatar-remove"><Trash2 className="mr-1 h-4 w-4" /> Remover</Button>}
      </div>
    </div>
  );
};
