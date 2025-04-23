const USER_ROLES = Object.freeze({
    BANNED:      0,
    UNVERIFIED:  1,
    VERIFIED:    2,
    OFFICER:     3,
    ADMIN:       4,
  });
  
  const isBanned      = role => role === USER_ROLES.BANNED;
  const isUnverified  = role => role === USER_ROLES.UNVERIFIED;
  const isVerified    = role => role === USER_ROLES.VERIFIED;
  const isOfficer     = role => role === USER_ROLES.OFFICER;
  const isAdmin       = role => role === USER_ROLES.ADMIN;
  
  export {
    USER_ROLES,
    isBanned,
    isUnverified,
    isVerified,
    isOfficer,
    isAdmin,
  };
  