'use client';

import {
  IconCircleCheck,
  IconBell,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconSparkles
} from '@tabler/icons-react';
import log from '@/lib/logger';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

// Icon mapping
const iconMap = {
  sparkles: IconSparkles,
  circleCheck: IconCircleCheck,
  creditCard: IconCreditCard,
  bell: IconBell,
  logout: IconLogout
};

export function NavUser({
  user,
  menuItems
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  menuItems: {
    title: string;
    icon: keyof typeof iconMap;
    url?: string;
    action?: string;
    group: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  // Group items by group
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, typeof menuItems>
  );

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    if (item.action === 'logout') {
      // Handle logout logic
      // keep as debug-level
      log.debug('Logging out...');
    } else if (item.action === 'upgrade') {
      // Handle upgrade logic
      log.debug('Upgrading...');
    } else if (item.url) {
      // Handle navigation
      window.location.href = item.url;
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <IconChevronsDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {Object.entries(groupedItems).map(([group, items], groupIndex) => (
              <div key={group}>
                <DropdownMenuGroup>
                  {items.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                      <DropdownMenuItem
                        key={item.title}
                        onClick={() => handleItemClick(item)}
                      >
                        <Icon className='mr-2 h-4 w-4' />
                        {item.title}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                {groupIndex < Object.keys(groupedItems).length - 1 && (
                  <DropdownMenuSeparator />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
