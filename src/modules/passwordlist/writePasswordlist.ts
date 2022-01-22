import path from 'path';
import { writeFileSync } from 'fs';
import { encrypt } from '../../utils/encrypt';
import { APPDATA } from '../../utils/paths';

function writePasswordlist(
    content: string,
    password: string,
    passwordlist: string
) {
    const encryptedContent = encrypt(content, password);

    writeFileSync(
        path.join(APPDATA, 'passwordlist', passwordlist),
        encryptedContent
    );
}

export default writePasswordlist;
