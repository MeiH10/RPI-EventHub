const USER_ROLES = Object.freeze({
  BANNED:      0, // User is blocked from accessing any protected resources
  UNVERIFIED:  1, // User has registered but not yet verified (e.g. email confirmation)
  VERIFIED:    2, // Regular, verified user with basic access
  OFFICER:     3, // Elevated privileges, can manage certain resources
  ADMIN:       4, // Full administrative access
});

// Check if the given role matches BANNED
const isBanned     = role => role === USER_ROLES.BANNED;

// Check if the given role matches UNVERIFIED
const isUnverified = role => role === USER_ROLES.UNVERIFIED;

// Check if the given role matches VERIFIED
const isVerified   = role => role === USER_ROLES.VERIFIED;

// Check if the given role matches OFFICER
const isOfficer    = role => role === USER_ROLES.OFFICER;

// Check if the given role matches ADMIN
const isAdmin      = role => role === USER_ROLES.ADMIN;

// Export the roles enum and the helper functions
export {
  USER_ROLES,
  isBanned,
  isUnverified,
  isVerified,
  isOfficer,
  isAdmin,
};