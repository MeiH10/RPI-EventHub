import React from 'react'
import { useAuth } from './context/AuthContext'
import { isUnverified } from '../../backend/useful_script/userRolesCheck'

export const USER_ROLES = Object.freeze({
  BANNED:      0,
  UNVERIFIED:  1,
  VERIFIED:    2,
  OFFICER:     3,
  ADMIN:       4,
})

export const Banned            = r => r === USER_ROLES.BANNED
export const Unverified        = r => r === USER_ROLES.UNVERIFIED
export const Verified          = r => r === USER_ROLES.VERIFIED
export const Officer           = r => r === USER_ROLES.OFFICER
export const Admin             = r => r === USER_ROLES.ADMIN
export const NotBanned         = r => !Banned(r)
export const AtLeastVerified   = r => r >= USER_ROLES.VERIFIED
export const AtLeastOfficer    = r => r >= USER_ROLES.OFFICER
export const AtLeastAdmin      = r => r >= USER_ROLES.ADMIN
export const LessThanVerified  = r => r <  USER_ROLES.VERIFIED
