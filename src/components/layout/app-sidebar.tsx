import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  User,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Procesar",
    url: "/process",
    icon: Zap,
  },
  {
    title: "Planes",
    url: "/plans",
    icon: CreditCard,
  },
];

const settingsItems = [
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
  },
  {
    title: "Configuración",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const currentMonth = profile?.usage_count || 0;
  const monthlyLimit = profile?.monthly_limit || 5;
  const usagePercentage = Math.min((currentMonth / monthlyLimit) * 100, 100);
  const creditsRemaining = Math.max(0, monthlyLimit - currentMonth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="bg-primary px-3 py-2 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">KW</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-foreground">PropGen</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Action Button */}
        <div className="p-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            asChild
          >
            <Link to="/process">
              <Zap className="h-4 w-4 mr-2" />
              {!isCollapsed && "Nueva Propiedad"}
            </Link>
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-muted data-[active=true]:text-primary"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credits Section */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Propiedades</span>
                <span className="text-xs text-muted-foreground">
                  {creditsRemaining} restantes
                </span>
              </div>
              <Progress value={usagePercentage} className="h-1" />
            </div>
          </div>
        )}

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-muted data-[active=true]:text-primary"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {profile?.full_name?.[0] || user?.email?.[0].toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || user?.email?.split("@")[0] || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
