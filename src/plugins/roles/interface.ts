/**
 * Access role for system administrator
 */
type TypeRoleAdmin = 'administrator'
/**
 * Access role for registered user
 */
type TypeRoleUser = 'user'
/**
 * List of available access roles
 */
type TypeRoles = TypeRoleAdmin | TypeRoleUser

/**
 * List available user roles
 */
class Role {
  public static readonly ADMIN: TypeRoleAdmin = 'administrator'
  public static readonly USER: TypeRoleUser = 'user'

  public static toArray () {
    return [
      Role.ADMIN,
      Role.USER
    ]
  }
}

export {
  Role,
  TypeRoles,
  TypeRoleAdmin,
  TypeRoleUser
}

export default Role
