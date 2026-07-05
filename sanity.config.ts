'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes, singletonTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

// Studio is mounted at /studio (see app/studio/[[...tool]]/page.tsx).
export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Prevent creating additional documents of singleton types via global actions.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Remove create/delete/duplicate actions for singletons.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) =>
            action ? ['publish', 'discardChanges', 'restore'].includes(action) : false
          )
        : input,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
