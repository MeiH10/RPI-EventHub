import React from 'react'
import { useAuth } from './context/AuthContext'

/**
 * USER_ROLES
 * Enumeration of all user roles to avoid magic numbers in your code.
 */
export const USER_ROLES = Object.freeze({
  BANNED:      0, // Blocked user
  UNVERIFIED:  1, // Needs to verify email or similar
  VERIFIED:    2, // Regular user
  OFFICER:     3, // Elevated privileges
  ADMIN:       4, // Full administrative access
})

/**
 * Banned(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is banned
 */
export const Banned = r => r === USER_ROLES.BANNED

/**
 * Unverified(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is unverified
 */
export const Unverified = r => r === USER_ROLES.UNVERIFIED

/**
 * Verified(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is verified
 */
export const Verified = r => r === USER_ROLES.VERIFIED

/**
 * Officer(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is an officer
 */
export const Officer = r => r === USER_ROLES.OFFICER

/**
 * Admin(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is an admin
 */
export const Admin = r => r === USER_ROLES.ADMIN

/**
 * NotBanned(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is not banned
 */
export const NotBanned = r => !Banned(r)

/**
 * AtLeastVerified(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is verified or higher
 */
export const AtLeastVerified = r => r >= USER_ROLES.VERIFIED

/**
 * AtLeastOfficer(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is officer or higher
 */
export const AtLeastOfficer = r => r >= USER_ROLES.OFFICER

/**
 * AtLeastAdmin(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is admin
 */
export const AtLeastAdmin = r => r >= USER_ROLES.ADMIN

/**
 * LessThanVerified(role)
 * @param {number} r — user role
 * @returns {boolean} true if user is below verified level (banned or unverified)
 */
export const LessThanVerified = r => r < USER_ROLES.VERIFIED
