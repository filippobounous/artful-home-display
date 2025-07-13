import {
  Home,
  Package,
  BarChart3,
  Settings,
  Palette,
  Sofa,
  MapPin,
  FileText,
  Lamp,
  Shapes,
  House,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/use-sidebar";
import { useSettingsState } from "@/hooks/useSettingsState";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "All Items", url: "/inventory", icon: Package },
  { title: "Drafts", url: "/drafts", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "palette":
      return Palette;
    case "sofa":
      return Sofa;
    case "lamp":
      return Lamp;
    case "house":
      return House;
    case "map-pin":
      return MapPin;
    default:
      return Shapes;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { categories, houses } = useSettingsState();

  // Dynamic category items based on configuration
  const categoryItems = categories
    .filter((c) => c.visible)
    .map((category) => ({
      title: category.name,
      url: `/category/${encodeURIComponent(category.id)}`,
      icon: getIconComponent(category.icon),
    }));

  // Dynamic house items based on configuration
  const houseItems = houses
    .filter((h) => h.visible)
    .map((house) => ({
      title: house.name,
      url: `/house/${encodeURIComponent(house.id)}`,
      icon: getIconComponent(house.icon),
    }));

  const checkActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active
      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium border-r-2 border-blue-600 dark:border-blue-400"
      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-700">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          {!isCollapsed ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Murgenere
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Collection Manager
              </p>
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
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active = checkActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={getNavCls({ isActive: active })}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Categories"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoryItems.map((item) => {
                const active = checkActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        className={getNavCls({ isActive: active })}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Houses */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs font-semibold">
            {!isCollapsed && "Houses"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {houseItems.map((item) => {
                const active = checkActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        className={getNavCls({ isActive: active })}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto border-t border-slate-200 dark:border-slate-700">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={checkActive("/settings")}
                  >
                    <NavLink
                      to="/settings"
                      className={getNavCls({
                        isActive: checkActive("/settings"),
                      })}
                    >
                      <Settings className="w-4 h-4" />
                      {!isCollapsed && <span>Settings</span>}
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
