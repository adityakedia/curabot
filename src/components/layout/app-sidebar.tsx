'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
// useUser removed because the user menu is hidden in this layout
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';

const platform = {
  name: 'CuraBot',
  subtitle: 'Care Dashboard'
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  // user menu is hidden; no runtime user data needed here
  const sidebar = useSidebar();
  const isCollapsed = sidebar?.state === 'collapsed';

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div
          className={`flex items-center transition-all duration-200 ${isCollapsed ? 'justify-center px-0 py-2' : 'gap-2 px-4 py-2 md:px-4 md:py-2'}`}
        >
          <div
            className={`bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg transition-all duration-200 ${isCollapsed ? 'mx-auto my-1 size-8' : 'size-8'}`}
          >
            <Icons.logo className={isCollapsed ? 'size-4' : 'size-4'} />
          </div>
          {!isCollapsed && (
            <div className='sidebar-labels grid flex-1 text-left text-sm leading-tight transition-all duration-200'>
              <span className='truncate font-semibold'>{platform.name}</span>
              <span className='truncate text-xs'>{platform.subtitle}</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* SidebarFooter with NavUser (profile menu) hidden as requested */}
      {/* <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user?.fullName || user?.firstName || 'User',
              email: user?.primaryEmailAddress?.emailAddress || '',
              avatar: user?.imageUrl || null
            }}
            menuItems={userMenuItems}
          />
        )}
      </SidebarFooter> */}

      <SidebarRail />
    </Sidebar>
  );
}
