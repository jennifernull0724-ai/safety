# ✅ CANONICAL ROUTING STRUCTURE

**Purpose**: Document authoritative routing hierarchy after Landing → Dashboard restructure.

---

## ROUTING HIERARCHY

### Public Routes (No Auth Required)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page (marketing entry) |
| `/login` | `app/(public)/login/page.tsx` | Authentication entry |
| `/create-account` | `app/(public)/create-account/page.tsx` | User registration |
| `/forgot-password` | `app/(public)/forgot-password/page.tsx` | Password recovery |
| `/pricing` | `app/(public)/pricing/select/page.tsx` | License tier selection |
| `/join-organization` | `app/(public)/join-organization/page.tsx` | Org access request |
| `/activate-license` | `app/(public)/activate-license/page.tsx` | License activation gate |
| `/verification-authority-enabled` | `app/(public)/verification-authority-enabled/page.tsx` | Trust boundary confirmation |
| `/onboarding/complete` | `app/(public)/onboarding/complete/page.tsx` | Post-payment success |

### Protected Routes (Auth + License Required)

| Route | File | Purpose | Middleware Check |
|-------|------|---------|------------------|
| `/dashboard` | `app/dashboard/page.tsx` | Main product dashboard | Auth, License, Authority |
| `/(platform)/*` | `app/(platform)/**` | All platform pages | Auth, License, Authority |

### API Routes

#### Public APIs (No Auth)
- `GET /api/public/landing` - Landing page data
- `GET /api/public/pricing` - License pricing tiers
- `POST /api/public/login` - Authentication
- `POST /api/public/password/reset` - Password reset
- `POST /api/public/register` - User creation
- `POST /api/public/organization/request-access` - Org access request

#### Billing APIs
- `POST /api/public/billing/create-checkout` - Stripe checkout creation (with promo codes)
- `POST /api/webhooks/stripe` - License activation webhook (ONLY place license activates)

#### Internal APIs (Auth Required)
- `/api/internal/*` - Protected API endpoints

---

## SMART CTA ROUTING

**Landing Page CTAs** (`/` at [app/page.tsx](app/page.tsx)):

```typescript
const [dashboardLink, setDashboardLink] = useState('/login');

useEffect(() => {
  const checkAuthState = async () => {
    // Not authenticated → Login
    if (!session) { setDashboardLink('/login'); return; }
    
    // Authenticated + no org → Pricing
    if (!user.organizationId) { setDashboardLink('/pricing/select'); return; }
    
    // Authenticated + active license → Dashboard
    if (license?.status === 'active') { setDashboardLink('/dashboard'); return; }
    
    // Default: Pricing
    setDashboardLink('/pricing/select');
  };
  checkAuthState();
}, []);
```

**CTA Buttons**:
- Nav: "Enter Dashboard" → `{dashboardLink}`
- Hero: "Enter Dashboard" → `{dashboardLink}`
- Footer CTA: "View Organization Licensing" → `/pricing`

---

## MIDDLEWARE ENFORCEMENT

**File**: [middleware.ts](middleware.ts)

### Protected Paths
```typescript
matcher: [
  "/dashboard/:path*",
  "/(platform)/:path*",
  // Also protects internal APIs and QR verification
]
```

### Protection Logic
```typescript
if (pathname.startsWith("/dashboard") || pathname.startsWith("/(platform)")) {
  // 1. Auth check (session exists)
  // 2. Organization check (user has organizationId)
  // 3. License check (license.status === 'active')
  // 4. Enterprise authority check (if tier === 'enterprise', must have verificationAuthority)
  
  // Redirects:
  // - No session → /login
  // - No org → /pricing/select
  // - No license → /activate-license
  // - Enterprise without authority → /activate-license
}
```

### Public Paths (No Middleware)
- `/` (Landing)
- `/login`, `/create-account`, `/forgot-password`
- `/pricing`, `/join-organization`, `/activate-license`
- `/verification-authority-enabled`, `/onboarding/complete`
- All public API routes (`/api/public/*`)

---

## STRIPE PURCHASE FLOW

**Entry**: Landing `/` → "View Licensing" → `/pricing`

**Flow**:
1. User selects tier at [/pricing](app/(public)/pricing/select/page.tsx)
2. Click "Purchase" → `POST /api/public/billing/create-checkout`
3. Checkout API:
   - Blocks Enterprise tiers (redirects to contact sales)
   - Creates Stripe session with `allow_promotion_codes: true`
   - Metadata: `{ userId, licenseTier, licenseType }`
4. User completes payment in Stripe
5. Stripe sends webhook to `POST /api/webhooks/stripe`
6. Webhook (ONLY place license activates):
   - Creates Organization
   - Attaches User as Owner/Admin
   - Creates License Record (`status: 'active'`)
   - Sets `organization.verificationAuthority = "enabled"`
   - Creates Audit Event (`type: 'license_activated'`)
7. Redirect to `/onboarding/complete?session_id={CHECKOUT_SESSION_ID}`
8. User clicks "Enter Dashboard" → `/dashboard` (now authorized)

---

## TRUST BOUNDARY FLOW

**Entry**: Create Account → Join Org → License Activation

**Flow**:
1. User creates account at [/create-account](app/(public)/create-account/page.tsx)
   - Creates user identity
   - Does NOT grant access, authority, or licenses
2. User requests org access at [/join-organization](app/(public)/join-organization/page.tsx)
   - Sets `user.status = "pending_org_access"`
   - Queues admin decision
   - Does NOT auto-grant
3. Admin approves (via admin panel)
   - Attaches user to organization
   - Sets role
4. Organization purchases license via Stripe (see Stripe flow above)
5. Admin activates license at [/activate-license](app/(public)/activate-license/page.tsx)
   - Sets `organization.verificationAuthority = "enabled"`
   - Sets `organization.trustStartAt = now()` (immutable timestamp)
   - Creates audit event
6. One-time confirmation at [/verification-authority-enabled](app/(public)/verification-authority-enabled/page.tsx)
   - Shows trust timestamp
   - Explains no retroactive authority
   - Links to Dashboard
7. User can now access [/dashboard](app/dashboard/page.tsx)

**Hard Rules**:
- Events prior to `trustStartAt` are NOT authoritative
- No retroactive authority grants
- Trust timestamp is immutable
- License activation is atomic (all or nothing)

---

## AUTHENTICATION FLOW

**Entry**: Landing `/` → "Enter Dashboard" (if unauthenticated) → `/login`

**Login Flow**:
1. User enters credentials at [/login](app/(public)/login/page.tsx)
2. `POST /api/public/login` authenticates
3. Success → redirects to `/dashboard` (if licensed) or `/pricing/select` (if not)
4. Not registered → triggers UserNotRegistered page
5. Forgot password link → [/forgot-password](app/(public)/forgot-password/page.tsx)

**Registration Flow**:
1. User creates account at [/create-account](app/(public)/create-account/page.tsx)
2. `POST /api/public/register` creates user identity
3. Redirects to `/pricing/select` (can purchase org license)
4. Or redirects to `/join-organization` (can request access to existing org)

---

## FILE STRUCTURE

```
app/
  page.tsx                          ← ROOT: Landing page (public)
  layout.tsx                        ← Root layout
  dashboard/
    page.tsx                        ← DASHBOARD: Protected product (auth + license)
  (public)/
    landing/page.tsx                ← Redundant (kept for reference)
    login/page.tsx
    create-account/page.tsx
    forgot-password/page.tsx
    join-organization/page.tsx
    activate-license/page.tsx
    verification-authority-enabled/page.tsx
    pricing/
      select/page.tsx
    onboarding/
      complete/page.tsx
  (platform)/
    layout.tsx                      ← Platform layout (protected)
    admin/
    ai-advisory/
    audit-vault/
    compliance/
    dispatch/
    employee-directory/
    employee-profile/
    executive/
    incidents/
    operations/
    people/
    safety/
    supervisor/
  (regulator)/
    layout.tsx
    audit/
    dashboard/
  api/
    public/
      landing/route.ts
      pricing/route.ts
      login/route.ts
      password/reset/route.ts
      register/route.ts
      organization/request-access/route.ts
      billing/create-checkout/route.ts
    webhooks/
      stripe/route.ts
    [internal APIs]/
      
middleware.ts                       ← Protects /dashboard and /(platform)/*
```

---

## CRITICAL INVARIANTS

### Landing Page (`/`)
- ✅ Public access (no auth required)
- ✅ No automatic redirects
- ✅ Refreshing `/` always loads Landing
- ✅ Smart CTA routing based on auth/license state
- ✅ No QR code logic, no pricing checks, no compliance
- ❌ NEVER auto-redirects to `/dashboard`
- ❌ NEVER blocks unauthenticated users

### Dashboard (`/dashboard`)
- ✅ Protected by middleware
- ✅ Requires authentication
- ✅ Requires active organization license
- ✅ Enterprise tiers require verification authority
- ❌ NEVER accessible without license
- ❌ NEVER loads at root `/`

### Middleware
- ✅ Protects `/dashboard` and `/(platform)/*`
- ✅ Redirects unauthenticated → `/login`
- ✅ Redirects no org → `/pricing/select`
- ✅ Redirects no license → `/activate-license`
- ❌ NEVER protects `/` (root Landing)
- ❌ NEVER protects public routes

### Stripe Integration
- ✅ Promo codes allowed for self-serve tiers only
- ✅ Enterprise blocked from self-serve checkout
- ✅ Webhook is ONLY place license activates
- ✅ License activation is atomic (all or nothing)
- ❌ NEVER activates license on checkout creation
- ❌ NEVER allows manual license creation outside webhook

---

## TESTING CHECKLIST

### Route Access
- [ ] `/` loads Landing page (no auth)
- [ ] `/dashboard` redirects to `/login` if unauthenticated
- [ ] `/dashboard` redirects to `/pricing/select` if no license
- [ ] `/dashboard` loads if authenticated + licensed
- [ ] `/login` accessible (public)
- [ ] `/pricing` accessible (public)
- [ ] `/create-account` accessible (public)

### Smart CTA Routing
- [ ] Unauthenticated: CTA links to `/login`
- [ ] Authenticated + no license: CTA links to `/pricing/select`
- [ ] Authenticated + active license: CTA links to `/dashboard`

### Middleware Enforcement
- [ ] `/dashboard` blocked without session
- [ ] `/dashboard` blocked without org
- [ ] `/dashboard` blocked without active license
- [ ] Enterprise tier blocked without verification authority
- [ ] Public routes (`/`, `/login`, `/pricing`) not protected

### Stripe Flow
- [ ] Select tier → creates checkout session
- [ ] Promo code field appears for self-serve
- [ ] Enterprise tier blocks self-serve (redirects to contact)
- [ ] Webhook activates license on `checkout.session.completed`
- [ ] License activation is atomic (creates org, user, license, authority)
- [ ] Success redirects to `/onboarding/complete`

### Trust Boundary
- [ ] Join org queues request (does not auto-grant)
- [ ] License activation sets `trustStartAt` timestamp
- [ ] Verification authority confirmation shows once
- [ ] Events prior to timestamp not authoritative

---

## NO BASE44 · NO REACT ROUTER · NO FRAMER MOTION

All pages use:
- ✅ Next.js `Link` (not `react-router`)
- ✅ Next.js `useRouter` (not `react-router`)
- ✅ CSS `@keyframes` animations (not Framer Motion)
- ✅ Lucide React icons
- ✅ Tailwind CSS dark slate theme
- ✅ Native HTML elements
- ❌ NO Base44 SDK
- ❌ NO custom UI components
- ❌ NO client-side fetching (props-driven)

---

## AUTH PROVIDER INTEGRATION POINTS

**Files with placeholder auth logic** (search for "AUTH PROVIDER"):

1. [app/page.tsx](app/page.tsx) - Landing CTA routing
2. [app/(public)/login/page.tsx](app/(public)/login/page.tsx) - Login submission
3. [app/(public)/create-account/page.tsx](app/(public)/create-account/page.tsx) - Registration
4. [app/(public)/forgot-password/page.tsx](app/(public)/forgot-password/page.tsx) - Password reset
5. [app/api/public/login/route.ts](app/api/public/login/route.ts) - Auth endpoint
6. [app/api/public/register/route.ts](app/api/public/register/route.ts) - Registration endpoint
7. [app/api/public/password/reset/route.ts](app/api/public/password/reset/route.ts) - Reset endpoint
8. [middleware.ts](middleware.ts) - Dashboard protection

**Replace placeholders with**:
- Session management (e.g., NextAuth, Supabase, Clerk)
- User queries (Prisma)
- License validation
- Organization scope enforcement

---

**Last Updated**: 2025 (Routing Restructure Complete)  
**Status**: ✅ Landing at root, Dashboard protected, Middleware enforced, Stripe integrated
