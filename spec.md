# Specification

## Summary
**Goal:** Fix the Internet Identity authentication flow so users can successfully log in via the login button on the AccessDeniedScreen.

**Planned changes:**
- Diagnose and fix the AuthClient login callback so it correctly completes the authentication flow
- Ensure the InternetIdentityProvider context updates the identity state after a successful login
- Fix the AuthGuard to correctly detect the authenticated identity and redirect users to the Friends List page instead of keeping them on the AccessDeniedScreen
- Show the ProfileSetupModal for new users after login completes
- Ensure logging out returns the user to the AccessDeniedScreen
- Eliminate console errors related to AuthClient, identity, or actor initialization during the login flow

**User-visible outcome:** Users can click the Internet Identity login button, complete authentication, and be redirected into the app. New users see the profile setup modal. Logging out returns them to the landing screen.
