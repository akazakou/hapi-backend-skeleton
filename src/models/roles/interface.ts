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
class Role {
  public static readonly ADMIN: TypeRoleAdmin = 'administrator'
  public static readonly USER: TypeRoleUser = 'user'
  public static readonly UNKNOWN: TypeRoleUnknown = 'unknown'

  public static toArray () {
    return [
      Role.ADMIN,
      Role.USER,
      Role.UNKNOWN
    ]
  }
}

export {
  Role,
  TypeRoles,
  TypeRoleAdmin,
  TypeRoleUser,
  TypeRoleUnknown
}

export default Role
