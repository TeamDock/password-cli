import path from 'path';
import { readFileSync } from 'fs';
import { decrypt } from '../../utils/decrypt';
import { APPDATA } from '../../utils/paths';

function readPasswordlist(passwordlist: string, password: string) {
    const encryptedFile = readFileSync(
        path.join(APPDATA, 'passwordlist', passwordlist)
    ).toString();

    return decrypt(encryptedFile, password);
}

export default readPasswordlist;
