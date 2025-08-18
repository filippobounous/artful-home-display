
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
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/use-sidebar';
import { useSettingsState } from '@/hooks/useSettingsState';
import { SidebarStatus } from '@/components/SidebarStatus';
import { LogoutButton } from '@/components/LogoutButton';

const mainItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'All Items', url: '/inventory', icon: Package },
  { title: 'Drafts', url: '/drafts', icon: FileText },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'palette':
      return Palette;
    case 'sofa':
      return Sofa;
    case 'lamp':
      return Lamp;
    case 'house':
      return House;
    case 'map-pin':
      return MapPin;
    default:
      return Shapes;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';
  const { categories, houses } = useSettingsState();

  // Dynamic category items based on configuration - ensure unique categories only
  const categoryItems = categories
    .filter((c) => c.visible)
    .filter(
      (category, index, arr) =>
        arr.findIndex((c) => c.id === category.id) === index,
    )
    .map((category) => ({
      title: category.name,
      url: `/category/${encodeURIComponent(category.id)}`,
      icon: getIconComponent(category.icon),
      categoryId: category.id,
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
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-primary'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

  return (
    <Sidebar className="flex flex-col" collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo Section */}
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-sidebar-border flex-shrink-0`}>
          {!isCollapsed ? (
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">
                Murgenere
              </h2>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="uppercase tracking-wider font-semibold">
                Main Menu
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => {
                  const active = checkActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={active}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          end={item.url === '/'}
                          className={getNavCls({ isActive: active })}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
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
          {categoryItems.length > 0 && (
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="uppercase tracking-wider font-semibold">
                  Categories
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {categoryItems.map((item) => {
                    const active = checkActive(item.url);
                    return (
                      <SidebarMenuItem key={`category-${item.categoryId}`}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={active}
                          tooltip={isCollapsed ? item.title : undefined}
                        >
                          <NavLink
                            to={item.url}
                            className={getNavCls({ isActive: active })}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Houses */}
          {houseItems.length > 0 && (
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="uppercase tracking-wider font-semibold">
                  Houses
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {houseItems.map((item) => {
                    const active = checkActive(item.url);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={active}
                          tooltip={isCollapsed ? item.title : undefined}
                        >
                          <NavLink
                            to={item.url}
                            className={getNavCls({ isActive: active })}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </div>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3">
        {/* Status Badges */}
        <SidebarStatus />
        
        {/* Action Buttons */}
        <SidebarMenu className="mt-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={checkActive('/settings')}
              tooltip={isCollapsed ? 'Settings' : undefined}
            >
              <NavLink
                to="/settings"
                className={getNavCls({
                  isActive: checkActive('/settings'),
                })}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <div className={isCollapsed ? 'flex justify-center' : ''}>
              <LogoutButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
