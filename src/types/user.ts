export interface TempUser {
  id: string;
  clerkUserId: string;
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'canceled';
  priceId?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Future user-related types can go here
export interface UserProfile {
  // when you need more user data
}

export interface SubscriptionData {
  // when you extract subscription logic
}
