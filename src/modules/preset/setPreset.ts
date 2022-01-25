import path from 'path';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { APPDATA } from '../../utils/paths';

function setPreset(name: string, content: any) {
    const presetPath = path.join(APPDATA, 'presets');
    mkdirSync(presetPath, { recursive: true });

    if (!existsSync(presetPath)) {
        appendFileSync(presetPath + `/${name}.preset`, content);
    } else {
        writeFileSync(presetPath + `/${name}.preset`, content);
    }
}

export { setPreset };
