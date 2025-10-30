# 🔐 Authentication Migration Guide

## Current State vs Production

### Current (Mock Auth)
- ✅ PIN-based login in `store.ts`
- ✅ Mock users in `mockData.ts`
- ✅ Local state management
- ❌ No real authentication
- ❌ No session management
- ❌ No password security

### Production (Supabase Auth)
- ✅ Real authentication with Supabase
- ✅ Secure password hashing
- ✅ Session management
- ✅ Row Level Security (RLS)
- ✅ Multi-factor authentication (optional)
- ✅ Password reset flows

---

## 📊 Understanding Users vs Customers

### Users (Login/Authentication)
**Table**: `auth.users` (Supabase Auth)
**Purpose**: Staff members who can log into the POS
**Examples**: Cashiers, managers, admin

**Fields**:
- `id` - UUID (auto-generated)
- `email` - Login email
- `encrypted_password` - Hashed password
- `user_metadata` - Custom data (name, PIN, roles, permissions)

### Customers (POS Customers)
**Table**: `customers` (Your schema)
**Purpose**: People who buy things from your store
**Examples**: Sarah Johnson, Michael Chen

**Fields**:
- `id` - UUID
- `name` - Customer name
- `email` - For receipts/marketing
- `phone` - Contact info
- `loyalty_points` - Reward points
- `total_spent` - Purchase history

**Key Difference**: Users log IN, Customers check OUT

---

## 🎯 Migration Strategy

### Phase 1: Create Auth Users (Manual - One Time)

**Option A: Via Supabase Dashboard** (Recommended for initial setup)

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. For each staff member, create:

**Admin User:**
```
Email: admin@auraflow.local
Password: (strong password)
Auto Confirm: ✅ Yes
User Metadata:
{
  "firstName": "Admin",
  "lastName": "User",
  "pin": "123456",
  "roles": ["admin", "cashier"],
  "permissions": ["all"],
  "isAdmin": true,
  "terminalIds": ["1", "2"]
}
```

**Cashier User:**
```
Email: john.cashier@auraflow.local
Password: (strong password)
Auto Confirm: ✅ Yes
User Metadata:
{
  "firstName": "John",
  "lastName": "Cashier",
  "pin": "567890",
  "roles": ["cashier"],
  "permissions": ["void_items", "apply_discounts", "process_returns"],
  "isAdmin": false,
  "terminalIds": ["1"]
}
```

**Option B: Via SQL** (For bulk creation)

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@auraflow.local',
  crypt('YourPassword123!', gen_salt('bf')),
  NOW(),
  '{
    "firstName": "Admin",
    "lastName": "User",
    "pin": "123456",
    "roles": ["admin", "cashier"],
    "permissions": ["all"],
    "isAdmin": true,
    "terminalIds": ["1", "2"]
  }'::jsonb,
  NOW(),
  NOW()
);
```

---

### Phase 2: Update Frontend Auth Components

#### 2.1 Update `lib/supabase.ts`

Add auth helper functions:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const authHelpers = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with PIN (staff quick login)
  async signInWithPIN(pin: string) {
    // Get all users and find by PIN in metadata
    // Note: This is less secure, consider implementing custom auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) return { data: null, error }
    
    const user = users?.find(u => u.user_metadata?.pin === pin)
    
    if (!user) {
      return { data: null, error: new Error('Invalid PIN') }
    }
    
    // Create session for this user (requires service role)
    // In production, implement proper PIN auth endpoint
    return { data: user, error: null }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
```

#### 2.2 Update `LoginScreen.tsx`

Replace mock auth with real Supabase auth:

```typescript
import { authHelpers } from '@/lib/supabase'
import { useStore } from '@/lib/store'

export function LoginScreen() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePINLogin = async () => {
    setLoading(true)
    setError('')

    const { data: user, error: authError } = await authHelpers.signInWithPIN(pin)

    if (authError || !user) {
      setError('Invalid PIN')
      setLoading(false)
      return
    }

    // Update Zustand store with user data
    useStore.getState().login({
      id: user.id,
      email: user.email,
      name: `${user.user_metadata.firstName} ${user.user_metadata.lastName}`,
      firstName: user.user_metadata.firstName,
      lastName: user.user_metadata.lastName,
      pin: user.user_metadata.pin,
      roles: user.user_metadata.roles || [],
      permissions: user.user_metadata.permissions || [],
      isAdmin: user.user_metadata.isAdmin || false,
      terminals: [], // Load from database
    })

    setLoading(false)
  }

  // ... rest of component
}
```

#### 2.3 Update `AdminLogin.tsx`

```typescript
import { authHelpers } from '@/lib/supabase'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await authHelpers.signIn(email, password)

    if (authError || !data.user) {
      setError('Invalid credentials')
      setLoading(false)
      return
    }

    // Check if user is admin
    if (!data.user.user_metadata?.isAdmin) {
      setError('Admin access required')
      await authHelpers.signOut()
      setLoading(false)
      return
    }

    // Update store
    useStore.getState().login({
      id: data.user.id,
      email: data.user.email,
      name: `${data.user.user_metadata.firstName} ${data.user.user_metadata.lastName}`,
      // ... rest of user data
    })

    setLoading(false)
  }

  // ... rest of component
}
```

---

### Phase 3: Implement Session Persistence

Add to `App.tsx`:

```typescript
import { authHelpers } from '@/lib/supabase'
import { useStore } from '@/lib/store'

function App() {
  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data } = await authHelpers.getSession()
      
      if (data.session?.user) {
        // Restore user to store
        const user = data.session.user
        useStore.getState().login({
          id: user.id,
          email: user.email,
          // ... map user metadata to store format
        })
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          useStore.getState().logout()
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Update store with user
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // ... rest of app
}
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Never commit service role key to frontend!
# Only use in backend/seeding scripts
```

### 2. Row Level Security (RLS)

Enable RLS on all tables:

```sql
-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read products
CREATE POLICY "Authenticated users can read products"
ON products FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can modify products
CREATE POLICY "Admins can modify products"
ON products FOR ALL
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Repeat for other tables
```

### 3. PIN Security

⚠️ **Current Limitation**: PINs stored in user_metadata are not ideal for production.

**Better Approach**:
1. Create separate `user_pins` table with hashed PINs
2. Implement custom auth endpoint for PIN verification
3. Use Supabase Edge Functions for serverless PIN auth

---

## 🎯 Migration Checklist

### Before Migration
- [ ] Backup current mock data
- [ ] Document all users and their permissions
- [ ] Test Supabase Auth in development

### During Migration
- [ ] Create users in Supabase Auth (manually or via SQL)
- [ ] Update `lib/supabase.ts` with auth helpers
- [ ] Update `LoginScreen.tsx` to use real auth
- [ ] Update `AdminLogin.tsx` to use real auth
- [ ] Implement session persistence in `App.tsx`
- [ ] Set up Row Level Security policies

### After Migration
- [ ] Test login with email/password
- [ ] Test login with PIN
- [ ] Test logout
- [ ] Test session persistence (refresh page)
- [ ] Test RLS policies (try accessing data without auth)
- [ ] Remove mock auth code from `store.ts`

---

## 📝 User Management (Post-Migration)

### Adding New Staff Members

**Via Supabase Dashboard:**
1. Authentication → Users → Add User
2. Fill in email, password, metadata
3. Auto-confirm user

**Via Admin Panel (Future Enhancement):**
Create a UsersModule that uses Supabase Auth Admin API:

```typescript
// In UsersModule.tsx (future)
import { supabase } from '@/lib/supabase'

async function createStaffMember(data) {
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      firstName: data.firstName,
      lastName: data.lastName,
      pin: data.pin,
      roles: data.roles,
      permissions: data.permissions,
      isAdmin: data.isAdmin,
    },
  })
  
  return { newUser, error }
}
```

---

## 🚨 Important Notes

### What the Python Seeding Script Does NOT Do:
- ❌ Does NOT create login users (auth.users)
- ❌ Does NOT set up authentication
- ❌ Does NOT create staff members

### What the Python Seeding Script DOES Do:
- ✅ Creates products (grocery, bar items)
- ✅ Creates customers (POS customers who buy things)
- ✅ Creates sample orders

### To Get Login Users:
You must manually create them via:
1. Supabase Dashboard → Authentication → Users
2. SQL INSERT into auth.users
3. Future: Admin panel user management

---

## 🔗 Related Documentation

- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Initial Supabase setup
- [SEEDING_GUIDE.md](SEEDING_GUIDE.md) - Database seeding (products/customers)
- [SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md) - Schema changes

---

**Last Updated**: October 29, 2025  
**Status**: Ready for Implementation
