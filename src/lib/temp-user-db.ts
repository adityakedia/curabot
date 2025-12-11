import fs from 'fs';
import path from 'path';
import { TempUser } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

interface TempDB {
  users: TempUser[];
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read database
function readDB(): TempDB {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    return { users: [] };
  }
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Write database
function writeDB(data: TempDB) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Create user
export function createUser(clerkUserId: string): TempUser {
  const db = readDB();
  const user: TempUser = {
    id: uuidv4(),
    clerkUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.users.push(user);
  writeDB(db);
  return user;
}

// Get user by Clerk ID
export function getUserByClerkId(clerkUserId: string): TempUser | null {
  const db = readDB();
  return db.users.find((user) => user.clerkUserId === clerkUserId) || null;
}

// Get user by Stripe customer ID
export function getUserByStripeId(stripeCustomerId: string): TempUser | null {
  const db = readDB();
  return (
    db.users.find((user) => user.stripeCustomerId === stripeCustomerId) || null
  );
}

// Update user
export function updateUser(
  clerkUserId: string,
  updates: Partial<TempUser>
): TempUser | null {
  const db = readDB();
  const userIndex = db.users.findIndex(
    (user) => user.clerkUserId === clerkUserId
  );
  if (userIndex === -1) return null;

  db.users[userIndex] = {
    ...db.users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  writeDB(db);
  return db.users[userIndex];
}

// Link user to Stripe customer
export function linkStripeCustomer(
  clerkUserId: string,
  stripeCustomerId: string
): TempUser | null {
  return updateUser(clerkUserId, { stripeCustomerId });
}

// Update subscription status
export function updateSubscription(
  clerkUserId: string,
  subscriptionData: {
    subscriptionStatus: 'active' | 'inactive' | 'canceled';
    priceId?: string;
    subscriptionId?: string;
  }
): TempUser | null {
  return updateUser(clerkUserId, subscriptionData);
}
