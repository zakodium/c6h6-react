import type { Dispatch } from 'react';
import { createContext, useContext } from 'react';

import type { RichTextActions, RichTextState } from './RichTextProvider';

export const richTextContext = createContext<
  [RichTextState, Dispatch<RichTextActions>] | null
>(null);

export function useRichTextContext() {
  const ctx = useContext(richTextContext);

  if (!ctx) {
    throw new Error('richTextContext not found');
  }

  return ctx;
}
