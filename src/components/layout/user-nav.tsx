'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import log from '@/lib/logger';

export function UserNav({
  menuItems
}: {
  menuItems: {
    title: string;
    icon: string;
    url?: string; // Make url optional
    action?: string; // Add action as optional
    group: string;
  }[];
}) {
  const { user } = useUser();
  const router = useRouter();

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
      // Handle logout - this is handled by SignOutButton
      return;
    } else if (item.action === 'upgrade') {
      // Handle upgrade logic
      log.debug('Upgrading...');
    } else if (item.url) {
      // Handle navigation
      router.push(item.url);
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <UserAvatarProfile user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {user.fullName}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {Object.entries(groupedItems).map(([group, items], groupIndex) => (
            <div key={group}>
              <DropdownMenuGroup>
                {items.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {groupIndex < Object.keys(groupedItems).length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutButton redirectUrl='/auth/sign-in' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
