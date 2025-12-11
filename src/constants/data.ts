import { NavItem } from '@/types';

export const platform = {
  name: 'CuraBot',
  subtitle: 'Care Dashboard',
  logo: 'logo' as const
};

export const userMenuItems = [
  {
    title: 'Profile',
    icon: 'circleCheck' as const,
    url: '/dashboard/profile',
    group: 'account'
  },
  {
    title: 'Billing',
    icon: 'creditCard' as const,
    url: '/dashboard/subscription',
    group: 'account'
  }
];

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Patients',
    url: '/dashboard/patients',
    icon: 'users',
    shortcut: ['p', 't'],
    isActive: false,
    items: []
  },
  {
    title: 'Call Logs',
    url: '/dashboard/logs',
    icon: 'phone',
    shortcut: ['c', 'l'],
    isActive: false,
    items: []
  }
];

// export interface SaleUser {
//   id: number;
//   name: string;
//   email: string;
//   amount: string;
//   image: string;
//   initials: string;
// }

// export const recentSalesData: SaleUser[] = [
//   {
//     id: 1,
//     name: 'Olivia Martin',
//     email: 'olivia.martin@email.com',
//     amount: '+$1,999.00',
//     image: 'https://api.slingacademy.com/public/sample-users/1.png',
//     initials: 'OM'
//   },
//   {
//     id: 2,
//     name: 'Jackson Lee',
//     email: 'jackson.lee@email.com',
//     amount: '+$39.00',
//     image: 'https://api.slingacademy.com/public/sample-users/2.png',
//     initials: 'JL'
//   },
//   {
//     id: 3,
//     name: 'Isabella Nguyen',
//     email: 'isabella.nguyen@email.com',
//     amount: '+$299.00',
//     image: 'https://api.slingacademy.com/public/sample-users/3.png',
//     initials: 'IN'
//   },
//   {
//     id: 4,
//     name: 'William Kim',
//     email: 'will@email.com',
//     amount: '+$99.00',
//     image: 'https://api.slingacademy.com/public/sample-users/4.png',
//     initials: 'WK'
//   },
//   {
//     id: 5,
//     name: 'Sofia Davis',
//     email: 'sofia.davis@email.com',
//     amount: '+$39.00',
//     image: 'https://api.slingacademy.com/public/sample-users/5.png',
//     initials: 'SD'
//   }
// ];
