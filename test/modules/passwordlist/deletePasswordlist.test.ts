import path from 'path';
import { existsSync } from 'fs';
import {
    createPasswordlist,
    deletePasswordlist,
} from '../../../src/modules/passwordlist';
import { APPDATA } from '../../../src/utils/paths';

test('testing deletePasswordlist', async () => {
    const passwordListName = 'deletePasswordlist-test';

    createPasswordlist(passwordListName);

    await deletePasswordlist(passwordListName);

    expect(
        existsSync(path.join(APPDATA, 'passwordlist', passwordListName))
    ).toBe(false);
});
