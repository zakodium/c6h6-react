import { FolderPlusIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EmptyState(props: EmptyStateProps) {
  const { icon = <FolderPlusIcon />, title, subtitle, children } = props;

  return (
    <div className="text-center">
      <div className="mx-auto size-12 text-neutral-400">{icon}</div>
      <h3 className="mt-2 text-sm font-medium text-neutral-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
