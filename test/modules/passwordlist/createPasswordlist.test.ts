import {
    createPasswordlist,
    deletePasswordlist,
} from '../../../src/modules/passwordlist';

test('testing createPasswordlist', () => {
    const passwordListName = 'createPasswordlist-test';

    const generatedPasswordlist = createPasswordlist(passwordListName);

    expect(generatedPasswordlist).toHaveLength(32);

    // Clean up
    deletePasswordlist(passwordListName);
});
