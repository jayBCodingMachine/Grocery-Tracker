# Feature 002: User Authentication

## Overview

**What:** Add AWS Cognito authentication with Google Sign-in and email/password to the Grocery Tracker app.

**Why:**
- Currently all users share the same `DEFAULT_USER_ID` - can't have multiple users
- Need user identity before implementing list sharing (Feature 003)
- AWS Cognito aligns with AWS certification prep goals
- Google sign-in for user convenience

## Implementation Details

### Authentication Methods
- **Google OAuth**: Federated identity through Cognito
- **Email/Password**: Native Cognito user pool with email verification

### Security Configuration
| Setting | Value | Reason |
|---------|-------|--------|
| Password policy | 8+ chars, upper/lower/num/special | Security best practice |
| Email verification | Required (click link) | Prevent fake signups |
| Rate limiting | 5 attempts, 15 min lockout | Brute force protection |
| Session duration | 30 days (remember me) | Family app convenience |
| Token refresh | Silent | Don't interrupt users |

### New Dependencies
```bash
npm install aws-amplify react-hot-toast
```

- **aws-amplify**: Official AWS library for Cognito auth, handles tokens, refresh, OAuth
- **react-hot-toast**: Lightweight toast notifications for error/success feedback

## Files Changed

### New Files Created
| File | Purpose |
|------|---------|
| `contexts/AuthContext.tsx` | Auth state management and methods |
| `lib/auth.ts` | Amplify configuration |
| `lib/auth-server.ts` | Server-side JWT verification |
| `components/AuthProvider.tsx` | App wrapper, configures Amplify |
| `components/LoginForm.tsx` | Email/password sign-in form |
| `components/SignUpForm.tsx` | Registration form |
| `components/GoogleSignInButton.tsx` | Official Google branding button |
| `components/ForgotPasswordForm.tsx` | Password reset flow |
| `components/UserMenu.tsx` | Header dropdown (profile + logout) |
| `components/LogoutConfirmModal.tsx` | Logout confirmation dialog |
| `app/login/page.tsx` | Login page with tabbed forms |
| `app/auth/callback/page.tsx` | OAuth redirect handler |

### Modified Files
| File | Changes |
|------|---------|
| `app/layout.tsx` | Added AuthProvider, Toaster, header with UserMenu |
| `app/page.tsx` | Added auth check and redirect logic |
| `components/GroceryList.tsx` | Added auth headers to API calls |
| `app/api/items/route.ts` | JWT verification, extract userId from token |

## Environment Variables Added

```env
# Cognito configuration (NEXT_PUBLIC_ makes them client-accessible)
NEXT_PUBLIC_AWS_REGION=us-east-2
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_xxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_DOMAIN=grocery-tracker-xxx.auth.us-east-2.amazoncognito.com

# Dev bypass (set to "true" to skip auth locally)
NEXT_PUBLIC_SKIP_AUTH=false
```

## AWS Setup Required

### Google Cloud Console
1. Create OAuth credentials (Web application type)
2. Add redirect URI: `https://<cognito-domain>.auth.us-east-2.amazoncognito.com/oauth2/idpresponse`
3. Save Client ID and Client Secret

### AWS Cognito
1. Create User Pool in us-east-2
2. Configure Google as identity provider
3. Set up hosted UI with callback URLs
4. Create app client (no secret)

## Testing Checklist

- [ ] Email signup with verification
- [ ] Google sign-in flow
- [ ] Password reset
- [ ] Session persistence (30 days)
- [ ] Rate limiting after 5 failed attempts
- [ ] API returns 401 without auth
- [ ] Dev bypass mode works
- [ ] Logout with confirmation

## Notes

- Old items under 'default_user' will remain; new items use Cognito user IDs
- Feature 003 (List Sharing) depends on this authentication being in place
