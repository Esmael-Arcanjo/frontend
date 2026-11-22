import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const [show, setShow] = useState(false);
  const testId = (props as Record<string, unknown>)["data-testid"] as string | undefined;
  return (
    <div className="relative">
      <Input ref={ref} {...props} type={show ? "text" : "password"} className={`pr-11 ${props.className || ""}`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground" data-testid={`${testId || "password"}-toggle`}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
