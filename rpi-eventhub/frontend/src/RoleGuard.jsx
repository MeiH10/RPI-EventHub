import React from 'react'
import { useAuth } from './AuthContext'

const USER_ROLES = Object.freeze({
  BANNED:      0,
  UNVERIFIED:  1,
  VERIFIED:    2,
  OFFICER:     3,
  ADMIN:       4,
})

const isBanned        = r => r === USER_ROLES.BANNED
const isNotBanned     = r => !isBanned(r)
const isVerified      = r => r === USER_ROLES.VERIFIED
const isOfficer       = r => r === USER_ROLES.OFFICER
const isAdmin         = r => r === USER_ROLES.ADMIN
const atLeastVerified = r => r >= USER_ROLES.VERIFIED
const atLeastOfficer  = r => r >= USER_ROLES.OFFICER
const atLeastAdmin    = r => r >= USER_ROLES.ADMIN

export const RoleGuard = ({ check, fallback = null, children }) => {
  const { role } = useAuth()
  if (isBanned(role)) return fallback
  return check(role) ? children : fallback
}

export const NotBanned       = props => <RoleGuard check={isNotBanned} {...props} />
export const VerifiedOnly    = props => <RoleGuard check={isVerified} {...props} />
export const OfficerOnly     = props => <RoleGuard check={isOfficer} {...props} />
export const AdminOnly       = props => <RoleGuard check={isAdmin} {...props} />
export const AtLeastVerified = props => <RoleGuard check={atLeastVerified} {...props} />
export const AtLeastOfficer  = props => <RoleGuard check={atLeastOfficer} {...props} />
export const AtLeastAdmin    = props => <RoleGuard check={atLeastAdmin} {...props} />
