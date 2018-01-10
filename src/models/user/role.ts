/**
 * Access role for system administrator
 */
type TypeRoleAdmin = 'administrator'
/**
 * Access role for registered user
 */
type TypeRoleUser = 'user'
/**
 * Access role for unknown user
 */
type TypeRoleUnknown = 'unknown'
/**
 * List of available access roles
 */
type TypeRoles = TypeRoleAdmin | TypeRoleUser | TypeRoleUnknown

/**
 * List available user roles
 * @type {{[key: string]: TypeRoles}}
 */
const Role: { ADMIN: TypeRoleAdmin; USER: TypeRoleUser; UNKNOWN: TypeRoleUnknown } = {
  ADMIN: 'administrator' as TypeRoleAdmin,
  USER: 'user' as TypeRoleUser,
  UNKNOWN: 'unknown' as TypeRoleUnknown
}

export {
  Role,
  TypeRoles,
  TypeRoleAdmin,
  TypeRoleUser,
  TypeRoleUnknown,
}
