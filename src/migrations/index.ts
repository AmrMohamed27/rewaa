import * as migration_20260810_155603 from './20260810_155603';
import * as migration_20260810_160751 from './20260810_160751';
import * as migration_20260810_163456 from './20260810_163456';

export const migrations = [
  {
    up: migration_20260810_155603.up,
    down: migration_20260810_155603.down,
    name: '20260810_155603',
  },
  {
    up: migration_20260810_160751.up,
    down: migration_20260810_160751.down,
    name: '20260810_160751',
  },
  {
    up: migration_20260810_163456.up,
    down: migration_20260810_163456.down,
    name: '20260810_163456'
  },
];
