import type { User, GenericEndpointContext } from 'better-auth';
import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole(statement);

const admin = ac.newRole({
  ...statement,
  user: statement.user.filter((permission) => permission !== 'impersonate-admins')
});

const member = ac.newRole({
  user: ['list', 'get']
});

const restricted = ac.newRole({});

export const roles = {
  owner,
  admin,
  member,
  restricted
};

export type RoleName = keyof typeof roles;
export const roleNames = Object.keys(roles) as RoleName[];
export const defaultRole: RoleName = 'restricted';

export function isRole(role: unknown): role is RoleName {
  if (typeof role !== 'string') return false;
  return roleNames.includes(role as RoleName);
}

export function asRole(role: unknown): RoleName {
  return isRole(role) ? role : defaultRole;
}

export function getRoleHierarchyIndex(role: RoleName) {
  // Smaller index means higher in the hierarchy
  const index = roleNames.indexOf(role);
  if (index === -1) return roleNames.length;
  return index;
}

export async function updateUserRoleHook(
  user: Partial<User> & Record<string, unknown>,
  ctx: GenericEndpointContext | null
) {
  if (!user.role) return true;

  const session = ctx?.context.session;
  const actorRole = asRole(session?.user.role);
  const targetRole = asRole(user.role);
  const actorIndex = getRoleHierarchyIndex(actorRole);
  const targetIndex = getRoleHierarchyIndex(targetRole);

  // Actor can only update roles lower in the hierarchy
  if (actorIndex >= targetIndex) return false;
  return true;
}
