import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";
import { api, errMsg } from "@/lib/api";

const BASE = process.env.REACT_APP_BACKEND_URL || "";

/** Turn a stored file id or backend-relative url into an absolute URL. */
export function resolveImage(value) {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  if (value.startsWith("/api/")) return BASE + value;
  return value;
}

export function ImageUpload({ value, onChange, label = "Enviar imagem", aspect = "square", testId = "image-upload" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const displayed = resolveImage(value);

  const pick = () => inputRef.current?.click();

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Envie uma imagem"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Máximo 8MB"); return; }
    setUploading(true);
    try {
      const { data: sig } = await api.get("/storage/cloudinary/signature");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.api_key);
      fd.append("timestamp", sig.timestamp);
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd });
      const out = await res.json();
      if (!res.ok || !out.secure_url) throw new Error(out?.error?.message || "Falha no upload");
      onChange(out.secure_url);
      toast.success("Imagem enviada");
    } catch (err) { toast.error(errMsg(err)); }
    finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clear = () => onChange("");

  const shape = aspect === "cover" ? "aspect-[3/1]" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-square";

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="image/*" onChange={handle} className="hidden" data-testid={`${testId}-file`} />
      <button type="button" onClick={pick} disabled={uploading} data-testid={`${testId}-btn`}
              className={`group relative w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/40 ${shape} transition hover:border-primary`}>
        {displayed ? (
          <img src={displayed} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-muted-foreground">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span>{uploading ? "Enviando…" : label}</span>
          </div>
        )}
        {displayed && !uploading && (
          <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs font-medium text-white group-hover:flex">
            Trocar imagem
          </span>
        )}
      </button>
      {displayed && (
        <button type="button" onClick={clear} data-testid={`${testId}-clear`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
          <X className="h-3 w-3" /> Remover
        </button>
      )}
    </div>
  );
}
