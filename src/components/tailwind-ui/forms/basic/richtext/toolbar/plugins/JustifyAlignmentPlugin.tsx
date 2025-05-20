import type { TooltipPluginElement } from '../types';

import FormatAlignmentPlugin from './utils/FormatAlignmentPlugin';

export default function JustifyPlacementPlugin(): TooltipPluginElement {
  return (
    <FormatAlignmentPlugin
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M3 17v-1.5h14V17Zm0-3.125v-1.5h14v1.5Zm0-3.125v-1.5h14v1.5Zm0-3.125v-1.5h14v1.5ZM3 4.5V3h14v1.5Z" />
        </svg>
      }
      pluginKey="justify"
    />
  );
}
