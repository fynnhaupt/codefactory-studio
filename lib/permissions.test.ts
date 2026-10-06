import { describe, expect, it } from 'vitest';
import type { GenericEndpointContext } from 'better-auth';
import { updateUserRoleHook } from './permissions';

const contextFor = (role: string) =>
  ({ context: { session: { user: { role } } } }) as GenericEndpointContext;

describe('updateUserRoleHook', () => {
  it.each([
    ['owner', 'admin', true],
    ['owner', 'restricted', true],
    ['admin', 'owner', false],
    ['admin', 'member', true],
    ['admin', 'admin', false],
    ['member', 'restricted', true],
    ['member', 'member', false],
    ['restricted', 'member', false]
  ] as const)('%s can set %s: %s', async (actorRole, targetRole, allowed) => {
    await expect(updateUserRoleHook({ role: targetRole }, contextFor(actorRole))).resolves.toBe(
      allowed
    );
  });

  it('allows updates that do not change the role', async () => {
    await expect(updateUserRoleHook({}, null)).resolves.toBe(true);
  });

  it.each([undefined, null, '', 0])(
    'allows a role update when the requested role is %s',
    async (role) => {
      await expect(updateUserRoleHook({ role }, contextFor('owner'))).resolves.toBe(true);
    }
  );

  it('treats a missing session as the lowest actor role', async () => {
    await expect(
      updateUserRoleHook({ role: 'restricted' }, {
        context: { session: null }
      } as GenericEndpointContext)
    ).resolves.toBe(false);
  });

  it('treats unknown actor and target roles as restricted', async () => {
    await expect(updateUserRoleHook({ role: 'unknown' }, contextFor('unknown'))).resolves.toBe(
      false
    );
  });
});
