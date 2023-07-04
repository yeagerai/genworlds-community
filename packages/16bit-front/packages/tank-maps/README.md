# `@yeager/tank-maps`

## Usage

```typescript
import { Tilemap, MAPS } from '@yeager/common-types';
import { loadTilemap } from '@yeager/tank-maps';

interface Props {
  map: MAPS;
  // ...
}

const { map } = props;
const tilemap: Tilemap = loadTilemap(map);
```
