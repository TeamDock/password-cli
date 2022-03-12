#!/usr/bin/env ts-node
import packageJson from '../package.json';
import { APPDATA } from './utils/paths';
import { program } from 'commander';
import { mkdirSync } from 'fs';
import generate from './commands/generate';
import verify from './commands/verify';
import get from './commands/get';
import save from './commands/save';
import passwordlist from './commands/passwordlist';
import preset from './commands/preset';
program.name('password-cli');
program.version(packageJson.version);

program
    .addCommand(generate)
    .addCommand(verify)
    .addCommand(save)
    .addCommand(get)
    .addCommand(passwordlist)
    .addCommand(preset);

function main(args: string[]) {
    mkdirSync(APPDATA, { recursive: true });

    program.parse(args);
}

main(process.argv);
export { program };
