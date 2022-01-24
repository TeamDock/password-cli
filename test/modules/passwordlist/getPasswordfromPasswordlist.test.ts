import { savePassword } from '../../../src/modules/password';
import {
    getPasswordfromPasswordlist,
    createPasswordlist,
    deletePasswordlist,
} from '../../../src/modules/passwordlist';

test('testing getPasswordfromPasswordlist', async () => {
    const passwordListName = 'getPasswordfromPasswordlist-test';

    const generatedPassword = createPasswordlist(passwordListName);

    await savePassword(passwordListName, 'somepasswordname', {
        noverify: true,
        password: 'somegreatpassword',
        passwordlistPassword: generatedPassword, // Password of passwordlist
    });

    const password = getPasswordfromPasswordlist(
        passwordListName,
        'somepasswordname',
        generatedPassword
    );

    expect(password).toBe('somegreatpassword');

    // Clean up
    deletePasswordlist(passwordListName);
});
