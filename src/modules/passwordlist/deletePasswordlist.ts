import { unlinkSync } from 'fs';
import path from 'path';
import { APPDATA } from '../../utils/paths';

async function deletePasswordlist(name: string) {
    const passwordsPath = path.join(APPDATA, 'passwordlist');
    const passwordListPath = path.join(passwordsPath, name);

    unlinkSync(passwordListPath);
}

export default deletePasswordlist;
