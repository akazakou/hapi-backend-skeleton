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
type TypeRoleEveryone = 'everyone'
/**
 * List of available access roles
 */
type TypeRoles = TypeRoleAdmin | TypeRoleUser | TypeRoleEveryone

/**
 * List available user roles
 */
class Role {
  public static readonly ADMIN: TypeRoleAdmin = 'administrator'
  public static readonly USER: TypeRoleUser = 'user'
  public static readonly EVERYONE: TypeRoleEveryone = 'everyone'

  public static toArray () {
    return [
      Role.ADMIN,
      Role.USER,
      Role.EVERYONE
    ]
  }
}

export {
  Role,
  TypeRoles,
  TypeRoleAdmin,
  TypeRoleUser,
  TypeRoleEveryone
}

export default Role
