import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export interface LightBannerProps {
  description: ReactNode;
  renderButton: () => ReactNode;
  onDismiss?: () => void;
}

export function LightBanner(props: LightBannerProps) {
  const { description, renderButton, onDismiss } = props;
  return (
    <div className="relative bg-primary-700">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <div className="font-semibold text-white">
            <span className="md:hidden">{description}</span>
            <span className="hidden md:inline">{description}</span>
            <span className="block sm:ml-2 sm:inline-block">
              {renderButton?.()}
            </span>
          </div>
        </div>
        {onDismiss && (
          <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
            <button
              type="button"
              onClick={onDismiss}
              className="flex rounded-md p-2 hover:bg-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden active:bg-primary-600"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="size-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
