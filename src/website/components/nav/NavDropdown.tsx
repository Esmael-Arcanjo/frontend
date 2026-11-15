import { ChevronDown, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type MenuItem = { id: string; label: string; to: string; hint?: string; icon: LucideIcon; badge?: string };
export type MenuGroup = { title: string; items: MenuItem[] };

const Group = ({ group, testId }: { group: MenuGroup; testId: string }) => (
  <div className="space-y-1">
    <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70">{group.title}</p>
    {group.items.map((item) => (
      <DropdownMenuItem key={item.id} asChild>
        <Link to={item.to} className="flex cursor-pointer !items-start gap-3 rounded-lg px-3 py-2.5" data-testid={`${testId}-item-${item.id}`}>
          <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-foreground" strokeWidth={1.75} />
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-[15px] font-semibold leading-tight">{item.label}
              {item.badge && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{item.badge}</span>}
            </span>
            {item.hint && <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{item.hint}</span>}
          </span>
        </Link>
      </DropdownMenuItem>
    ))}
  </div>
);

export const NavDropdown = ({ label, columns, testId }: { label: string; columns: MenuGroup[][]; testId: string }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <button type="button" className="group inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-primary" data-testid={testId}>
        {label} <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" sideOffset={14} className="w-[min(92vw,760px)] max-h-[75vh] overflow-y-auto rounded-xl p-4 shadow-xl" data-testid={`${testId}-panel`}>
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {columns.map((col, i) => (
          <div key={i} className="space-y-4">{col.map((g) => <Group key={g.title} group={g} testId={testId} />)}</div>
        ))}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);
