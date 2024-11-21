import chalk from 'chalk';
import { execa } from 'execa';
import { join } from 'path';
import {
    getAllDataPathsFromAdapters,
    getArchivedUrls,
    getArchiveErrors,
    getReasoningUrlsFromAdapters,
} from './lib/archiving';

const fileIsTrackedInGit = (path) =>
    execa('git', ['ls-files', '--error-unmatch', path], { reject: false }).then((proc) => proc.exitCode === 0);

(async () => {
    const adapterPaths = process.argv.slice(2);
    let template = '';

    const errors = (
        await Promise.all(
            adapterPaths.map(async (adapterPath) => {
                const messages: string[] = [];
                const adapterModule = await import(adapterPath);

                if (!adapterModule.adapters) return;

                const { archivedUrls, archivedDataPaths } = await getArchivedUrls();
                const reasoningExternalUrls = await getReasoningUrlsFromAdapters(adapterModule.adapters);
                const reasoningLocalUrls = await getAllDataPathsFromAdapters(adapterModule.adapters)
                    .filter((dataPath) => /^(?!http).+\.md$/.test(dataPath[2].reasoning))
                    .reduce((acc, dataPath) => {
                        acc.add(dataPath[2].reasoning);
                        return acc;
                    }, new Set<string>());
                const archiveErrors = await getArchiveErrors();

                await Promise.all(
                    [...reasoningLocalUrls].map(async (localPath) => {
                        if (await fileIsTrackedInGit(join('./research-docs', localPath))) return;
                        messages.push(
                            chalk.red('No documentation file found for "') +
                                chalk.bold.red(localPath) +
                                chalk.red('". Please create the file and add it to git.')
                        );
                    })
                );

                Object.entries(reasoningExternalUrls).forEach(([url, dataPaths]) => {
                    const unarchivedPaths = archivedUrls.has(url)
                        ? dataPaths.filter((path) => !archivedDataPaths[url].has(path))
                        : dataPaths;

                    if (unarchivedPaths.length > 0) {
                        const paths = [...new Set(unarchivedPaths)].join(';');
                        messages.push(
                            chalk.red('"') +
                                chalk.bold.red(url) +
                                chalk.red(
                                    `" is not archived for ${paths}` +
                                        (archiveErrors[url]
                                            ? `\n  -> There was an error while archiving: "${archiveErrors[url].error.message}"`
                                            : '')
                                )
                        );

                        template += `"${url}","TODO","${new Date().toISOString()}","${paths}"\n`;
                    }
                });

                if (messages.length > 0) return { adapterPath, messages, template };
            })
        )
    ).filter(Boolean) as { adapterPath: string; messages: string[] }[];

    if (errors.length > 0) {
        /* eslint-disable no-console */
        errors.forEach(({ adapterPath, messages }) => {
            console.log(chalk.bold.red(`\n${adapterPath}`));
            console.log(messages.join('\n'));
        });

        if (template) {
            console.log();
            console.log(chalk.bold('Template for adding them manually:'));
            console.log(template);
        }
        /* eslint-enable no-console */

        process.exit(1);
    }
    process.exit(0);
})();
