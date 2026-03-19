import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Shield, LayoutDashboard, Building2, Search, ClipboardList,
  FolderOpen, Bell, Bot, FileText, LogOut, ChevronLeft,
  ChevronRight, Menu, X, User
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentPage, setPage, logout, currentUser, company, alerts } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.leida).length;

  const navItems: NavItem[] = [
    { id: "dashboard",       label: "Dashboard",           icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "company",         label: "Mi Empresa",          icon: <Building2 className="w-4 h-4" /> },
    { id: "diagnosis",       label: "Diagnóstico",         icon: <Search className="w-4 h-4" /> },
    { id: "compliance-plan", label: "Plan de Cumplimiento",icon: <ClipboardList className="w-4 h-4" /> },
    { id: "evidence",        label: "Evidencias",          icon: <FolderOpen className="w-4 h-4" /> },
    { id: "alerts",          label: "Alertas",             icon: <Bell className="w-4 h-4" />, badge: unreadAlerts },
    { id: "ai-assistant",    label: "Asistente IA",        icon: <Bot className="w-4 h-4" /> },
    { id: "reports",         label: "Reportes",            icon: <FileText className="w-4 h-4" /> },
  ];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">Compliance360</p>
            <p className="text-white/40 text-xs">Colombia</p>
          </div>
        )}
      </div>

      {/* Company name */}
      {(!collapsed || mobile) && company && (
        <div
          className="px-4 py-3 border-b mx-2 mt-2 rounded-lg"
          style={{ background: "hsl(var(--sidebar-accent))", borderColor: "transparent" }}
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Empresa activa</p>
          <p className="text-white text-xs font-semibold truncate">{company.nombre}</p>
          <p className="text-white/40 text-xs">NIT: {company.nit}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); if (mobile) setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {(!collapsed || mobile) && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge && item.badge > 0 && (
                <span
                  className="ml-auto flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: "hsl(var(--danger))", color: "white" }}
                >
                  {item.badge}
                </span>
              )}
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-sidebar-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20">
            <User className="w-4 h-4 text-white" />
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{currentUser?.nombre}</p>
              <p className="text-white/40 text-xs truncate capitalize">{currentUser?.rol?.replace("_", " ")}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-20 -right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors z-10"
          style={{ left: collapsed ? "52px" : "228px" }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative w-64 flex flex-col z-10"
            style={{ background: "hsl(var(--sidebar-background))" }}
          >
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {navItems.find((n) => n.id === currentPage)?.label ?? "Dashboard"}
              </h2>
              {company && (
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {company.nombre} · NIT {company.nit}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage("alerts")}
              className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
              )}
            </button>
            <button
              onClick={() => setPage("ai-assistant")}
              className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
