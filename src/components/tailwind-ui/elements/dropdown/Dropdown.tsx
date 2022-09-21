import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Placement } from '@popperjs/core';
import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { usePopper } from 'react-popper';

import { Portal } from '../../overlays/Portal';
import { Size } from '../../types';

export interface DropdownOption<T> {
  type: 'option';
  icon?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
  data?: T;
}

export type DropdownElement<T> = DropdownOption<T> | DropdownStaticOption;

export interface DropdownStaticOption {
  type: 'static';
  content: ReactNode;
}

export interface DropdownProps<T> {
  children?: ReactNode;
  buttonClassName?: string;
  disabled?: boolean;
  size?: Size;
  /**
   * If set to true only the custom style passed in buttonClassName will be used to
   * style the dropdown button
   */
  noDefaultButtonStyle?: boolean;
  className?: string;
  title?: string;
  options: DropdownElement<T>[][];
  onSelect: (selected: DropdownOption<T>) => void;
  placement?: Placement;
}

const titleClassName =
  'inline-flex justify-center w-full rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-sm font-semibold text-neutral-700 hover:enabled:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 focus:ring-primary-500';
const iconClassName =
  'rounded-full flex items-center text-neutral-400 hover:enabled:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 focus:ring-primary-500';

export function Dropdown<T>(props: DropdownProps<T>): React.ReactElement {
  const {
    className,
    title,
    options,
    onSelect,
    noDefaultButtonStyle,
    children,
    buttonClassName,
    disabled,
    size = Size.medium,
    placement = 'bottom-end',
  } = props;
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);
  const [targetRef, setTargetRef] = useState<HTMLButtonElement | null>(null);

  const { styles, state } = usePopper(targetRef, contentRef, {
    placement,
  });

  return (
    <Menu>
      {(menu) => (
        <div
          className={clsx(
            'text-left',
            { relative: menu.open },
            className || 'inline-block',
          )}
        >
          <Menu.Button
            ref={setTargetRef}
            disabled={disabled}
            className={
              noDefaultButtonStyle
                ? buttonClassName
                : clsx(
                    children ? iconClassName : titleClassName,
                    buttonClassName,
                  )
            }
          >
            {children ? (
              children
            ) : (
              <div className="flex items-center">
                {title ? (
                  title
                ) : (
                  // element with a line height but no width
                  <span className="w-0 whitespace-pre-wrap"> </span>
                )}
                <ChevronDownIcon
                  className={clsx(
                    {
                      'h-4 w-4': size === Size.xSmall,
                      'h-5 w-5': size === Size.small || size === Size.medium,
                      'h-6 w-6': size === Size.large || size === Size.xLarge,
                    },
                    title ? 'ml-2 -mr-1' : '-mx-2',
                  )}
                />
              </div>
            )}
          </Menu.Button>

          <Portal>
            <div ref={setContentRef} style={styles.popper}>
              <Transition
                show={menu.open}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className={clsx(
                    'w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                    getMargin(state?.placement || placement),
                  )}
                >
                  <div className="divide-y divide-neutral-100 py-1" role="menu">
                    {options.map((options, index1) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div className="py-1" key={index1}>
                        {options.map((option, index2) => {
                          if (option.type === 'option') {
                            return (
                              <Menu.Item
                                disabled={option.disabled}
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${index1}-${index2}`}
                              >
                                {({ active }) => (
                                  <div
                                    onClick={() => onSelect(option)}
                                    className={clsx(
                                      'focus:outline-none',
                                      option.disabled
                                        ? 'text-neutral-400'
                                        : 'text-neutral-700',
                                      {
                                        'bg-neutral-100 text-neutral-900':
                                          active,
                                      },
                                    )}
                                  >
                                    <span
                                      className={clsx(
                                        'block w-full px-4 py-2 text-left text-sm focus:outline-none',
                                        option.disabled
                                          ? 'cursor-default'
                                          : 'cursor-pointer',
                                        {
                                          'group flex items-center':
                                            option.icon,
                                          'block justify-between ':
                                            !option.icon,
                                        },
                                      )}
                                    >
                                      {option.icon !== undefined && (
                                        <span
                                          className={clsx(
                                            'mr-3 h-5 w-5',
                                            active
                                              ? 'text-neutral-500'
                                              : ' text-neutral-400',
                                          )}
                                        >
                                          {option.icon}
                                        </span>
                                      )}
                                      {option.label}
                                    </span>
                                  </div>
                                )}
                              </Menu.Item>
                            );
                          } else {
                            return (
                              <div
                                className="px-4 py-2 text-sm"
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${index1}-${index2}`}
                              >
                                {option.content}
                              </div>
                            );
                          }
                        })}
                      </div>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </div>
          </Portal>
        </div>
      )}
    </Menu>
  );
}

const margins: Record<string, string> = {
  top: 'mb-2',
  bottom: 'mt-2',
  left: 'mr-2',
  right: 'ml-2',
};

function getMargin(placement: Placement) {
  return margins[placement.split('-')[0]];
}
