import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './sanity/env';

export default defineCliConfig({
  api: { projectId, dataset },
  // Studio is embedded in the Next.js app; no autoUpdates needed for CLI deploys.
  autoUpdates: true,
});
