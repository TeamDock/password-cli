import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { program } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { loadPreset } from '../modules/preset/loadPreset';
import { setPreset } from '../modules/preset/setPreset';
import { APPDATA } from '../utils/paths';

const setSubCmd = program
    .command('set <name>')
    .description('Create or set a preset')
    .action(async (name) => {
        const presetPath = path.join(APPDATA, 'presets', name + '.preset');

        const defaultPreset = {
            numbers: true,
            symbols: true,
            length: '20',
        };

        const result = JSON.parse(
            (
                await inquirer.prompt({
                    type: 'editor',
                    message: '',
                    name: 'editor',
                    default: existsSync(presetPath)
                        ? readFileSync(presetPath)
                        : JSON.stringify(defaultPreset, null, 2),
                })
            ).editor
        );

        setPreset(name, JSON.stringify(result));
    });

const getSubCmd = program
    .command('get <name>')
    .description('get preset')
    .action(async (name) => {
        const presetPath = path.join(APPDATA, 'presets', name + '.preset');

        if (!existsSync(presetPath))
            throw new Error('This preset do not exists.');

        const preset = JSON.parse(loadPreset(name));

        console.log(`Include symbols: ${chalk.green(preset.symbols)}`);
        console.log(`Include numbers: ${chalk.green(preset.numbers)}`);
        console.log(`Password length: ${chalk.green(preset.length)}`);
        console.log(`Hidden mode: ${chalk.green(preset.hidden ?? false)}`);
    });

export default program
    .command('preset')
    .addCommand(setSubCmd)
    .addCommand(getSubCmd);
