import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['src/components/ui/**', 'src/routeTree.gen.ts', 'src/utils/supabase/database.types.ts']
};

export default config;