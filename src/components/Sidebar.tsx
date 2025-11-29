import { Package, Coffee, CheckCircle, Search, Settings, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { useShiftStore } from "@/components/shiftStore";


export const Sidebar = () => {
  const { shift } = useShiftStore();

  const navItems = [
    {
      title: "Đơn hàng hôm nay",
      icon: Package,
      path: "/don-moi",
    },
    {
      title: "Đang pha chế",
      icon: Coffee,
      path: "/pha-che",
      isActive: true,
    },
    {
      title: "Đã hoàn tất",
      icon: CheckCircle,
      path: "/hoan-tat",
    },
    {
      title: "Tra cứu công thức",
      icon: Search,
      path: "/cong-thuc",
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">

      {/* Logo & Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Coffee className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Aurum</h1>
            <p className="text-xs text-muted-foreground">Barista Station</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
            activeClassName="bg-accent text-accent-foreground font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{item.title}</span>

          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">B</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">Barista</p>
            <p className="text-xs text-muted-foreground">
              Ca làm việc: {shift}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
