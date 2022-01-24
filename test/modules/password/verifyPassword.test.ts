import { verifyPassword } from '../../../src/modules/password';

test('testing verifyPassword', async () => {
    const result = await verifyPassword('qwerty');

    if (!result) throw new Error('qwerty is not a great password...');

    const found = parseInt(result.found);

    expect(found).toBeGreaterThan(0);
});
