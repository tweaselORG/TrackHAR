import { getDirname } from 'cross-dirname';
import { readdir } from 'fs/promises';
import { basename, join } from 'path';
import type { Adapter } from '../index';

const __dirname = getDirname();
const adapterDir = join(__dirname, '..', 'adapters');

export const getAllAdapters = async () =>
    Promise.all(
        (await readdir(adapterDir))
            .map((f) => join(adapterDir, f))
            .map((f) =>
                import(f).then((i) => {
                    const adapters = i.adapters as Adapter[];
                    if (adapters.some((a) => a.tracker.slug !== basename(f, '.ts')))
                        throw new Error("Tracker slug in adapter doesn't match filename.");
                    return adapters;
                })
            )
    ).then((a) => a.flat());
