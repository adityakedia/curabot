/**
 * UI component type definitions
 * Contains interfaces for navigation items, footers, and related structures
 */

import { Icons } from '@/components/icons';

// ============================================================================
// BASE NAVIGATION INTERFACES
// ============================================================================

/**
 * Base navigation item interface with all possible properties
 */
export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

/**
 * Navigation item that must have children items
 */
export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

/**
 * Navigation item that may optionally have children items
 */
export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

// ============================================================================
// FOOTER INTERFACES
// ============================================================================

/**
 * Footer section interface with title and nested items
 */
export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

// ============================================================================
// NAVIGATION TYPE ALIASES
// ============================================================================

/**
 * Type alias for main navigation items (may have optional children)
 */
export type MainNavItem = NavItemWithOptionalChildren;

/**
 * Type alias for sidebar navigation items (must have children)
 */
export type SidebarNavItem = NavItemWithChildren;
