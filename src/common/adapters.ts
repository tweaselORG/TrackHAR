import { adapters as facebook } from '../adapters/facebook';
import { adapters as google } from '../adapters/google';
import { adapters as yandex } from '../adapters/yandex';

export const allAdapters = [...facebook, ...google, ...yandex];
