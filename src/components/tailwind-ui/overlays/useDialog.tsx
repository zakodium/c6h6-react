import type { MouseEventHandler, ReactEventHandler, RefObject } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useKbsDisableGlobal } from 'react-kbs';

import { useOnOff } from '../hooks/useOnOff';

interface UseDialogOptions {
  dialogRef: RefObject<HTMLDialogElement>;
  isOpen: boolean;
  requestCloseOnEsc: boolean;
  requestCloseOnBackdrop: boolean;
  onRequestClose: () => void;
}

interface UseDialogReturn {
  dialogProps: {
    onClick: MouseEventHandler<HTMLDialogElement>;
    onCancel: ReactEventHandler<HTMLDialogElement>;
    onClose: UseDialogOptions['onRequestClose'];
  };
  isModalShown: boolean;
}

export function useDialog({
  dialogRef,
  isOpen,
  requestCloseOnEsc,
  requestCloseOnBackdrop,
  onRequestClose,
}: UseDialogOptions): UseDialogReturn {
  useKbsDisableGlobal(isOpen);
  const [isModalShown, showModal, hideModal] = useOnOff(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (!isOpen) return;

    showModal();
    dialog.showModal();
  }, [dialogRef, isOpen, showModal, hideModal]);

  const onCancel = useCallback<ReactEventHandler<HTMLDialogElement>>(
    (event) => {
      if (!requestCloseOnEsc) {
        event.preventDefault();
      }
    },
    [requestCloseOnEsc],
  );

  const onClick = useCallback<MouseEventHandler<HTMLDialogElement>>(
    (event) => {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      // Ref: https://stackoverflow.com/questions/25864259/how-to-close-the-new-html-dialog-tag-by-clicking-on-its-backdrop
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      event.stopPropagation();
      // Since the dialog has no size of itself, this condition is only
      // `true` when we click on the backdrop.
      if (!isInDialog && requestCloseOnBackdrop) {
        onRequestClose();
      }
    },
    [requestCloseOnBackdrop, onRequestClose, dialogRef],
  );

  const dialogProps = useMemo<UseDialogReturn['dialogProps']>(
    () => ({ onClick, onCancel, onClose: onRequestClose }),
    [onClick, onCancel, onRequestClose],
  );

  return {
    dialogProps,
    isModalShown,
  };
}
