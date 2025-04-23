import React from 'react'
import { useAuth } from './context/AuthContext'
import { isUnverified } from '../../backend/useful_script/userRolesCheck'

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
const isLessThanVerified = r => r < USER_ROLES.VERIFIED

export const RoleGuard = ({ check, fallback = null, children }) => {
  const { role } = useAuth()
  if (isBanned(role)) return fallback
  return check(role) ? children : fallback
}

export const NotBanned       = props => <RoleGuard check={isNotBanned} {...props} />
export const Verified    = props => <RoleGuard check={isVerified} {...props} />
export const Unverified    = props => <RoleGuard check={isUnverified} {...props} />
export const Officer     = props => <RoleGuard check={isOfficer} {...props} />
export const Admin       = props => <RoleGuard check={isAdmin} {...props} />
export const AtLeastVerified = props => <RoleGuard check={atLeastVerified} {...props} />
export const AtLeastOfficer  = props => <RoleGuard check={atLeastOfficer} {...props} />
export const AtLeastAdmin    = props => <RoleGuard check={atLeastAdmin} {...props} />
export const LessThanVerified = props => <RoleGuard check={isLessThanVerified} {...props} />
