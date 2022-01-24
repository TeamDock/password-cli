import {
    createPasswordlist,
    deletePasswordlist,
    listAllPasswordlist,
} from '../../../src/modules/passwordlist';

test('testing listAllPasswordlist', async () => {
    const passwordListName = 'listAllPasswordlist-test';
    createPasswordlist(passwordListName);

    expect(listAllPasswordlist()).toEqual([passwordListName]);

    // Clean up
    deletePasswordlist(passwordListName);
});
