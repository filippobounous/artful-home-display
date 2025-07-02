
import { Home, Package, Plus, BarChart3, Settings, Palette, Sofa } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "All Items", url: "/inventory", icon: Package },
  { title: "Add Item", url: "/add", icon: Plus },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const categoryItems = [
  { title: "Art & Paintings", url: "/art", icon: Palette },
  { title: "Furniture", url: "/furniture", icon: Sofa },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active 
      ? "bg-blue-100 text-blue-900 font-medium border-r-2 border-blue-600" 
      : "hover:bg-slate-100 text-slate-700";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarContent className="bg-white border-r border-slate-200">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          {!collapsed ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900">ArtiFurn</h2>
              <p className="text-sm text-slate-600">Inventory Manager</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 uppercase tracking-wider text-xs font-semibold">
            {!collapsed && "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 uppercase tracking-wider text-xs font-semibold">
            {!collapsed && "Categories"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto border-t border-slate-200">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/settings"
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <Settings className="w-4 h-4" />
                      {!collapsed && <span>Settings</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
