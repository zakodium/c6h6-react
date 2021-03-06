import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { useSameWidthPopper } from '../../hooks/popper';

import {
  labelDisabledColor,
  labelColor,
  inputError,
  inputColor,
} from './common';

export interface SimpleSelectOption {
  value: string | number;
  label: ReactNode;
}

export type GetValue<OptionType> = (option: OptionType) => string | number;
export type RenderOption<OptionType> = (option: OptionType) => ReactNode;

function simpleGetValue(option: SimpleSelectOption) {
  return option.value;
}

function simpleRenderOption(option: SimpleSelectOption) {
  return option.label;
}

export interface SelectProps<OptionType> extends SimpleSelectProps<OptionType> {
  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption: RenderOption<OptionType>;
}

export interface SimpleSelectProps<OptionType> {
  /**
   * List of options to select from.
   */
  options: OptionType[];
  /**
   * Currently selected option.
   */
  selected?: OptionType;
  /**
   * Callback which will be called when an option is selected or when clearing is requested.
   */
  onSelect?: (selected: OptionType | undefined) => void;

  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue?: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption?: RenderOption<OptionType>;

  /**
   * Field label.
   */
  label?: string;
  /**
   * Explanation or precisions about what the field is for.
   */
  help?: string;
  /**
   * Error message.
   */
  error?: string;
  /**
   * Placeholder to display when no value is selected.
   */
  placeholder?: string;

  /**
   * Adds a red * to the label.
   */
  required?: boolean;
  /**
   * Allows to unselect the currently selected value.
   */
  clearable?: boolean;
  /**
   * Disable interactions with the field.
   */
  disabled?: boolean;

  /**
   * Class applied to the outermost div element.
   */
  className?: string;
  /**
   * Class applied to the highlighted option.
   */
  highlightClassName?: string;
  /**
   * Whether the component is supposed to be rendered inline.
   * Currently only affects the placement of the clear button.
   */
  inline?: boolean;
}

export function Select<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleSelectProps<OptionType>
    : SelectProps<OptionType>,
): JSX.Element {
  const {
    options,
    selected,
    onSelect,
    className,
    label,
    error,
    help,
    placeholder,
    required = false,
    clearable = false,
    disabled = false,
    inline = false,
    getValue = simpleGetValue,
    renderOption = simpleRenderOption,
    highlightClassName = 'text-white bg-primary-600',
  } = props;

  const selectedValue = selected ? getValue(selected) : undefined;

  const { setReferenceElement, setPopperElement, popperProps } =
    useSameWidthPopper({ placement: 'bottom', distance: 5 });

  function handleChange(value: string | number | undefined) {
    if (!onSelect) {
      return;
    }
    if (value === undefined) {
      return onSelect(value);
    }
    const option = options.find((option) => getValue(option) === value);
    if (!option) {
      throw new Error('unreachable');
    }
    onSelect(option);
  }

  return (
    <div className={className}>
      <Listbox
        as="div"
        className="space-y-1"
        value={selectedValue}
        disabled={disabled}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            <div className="flex items-center justify-between w-full">
              <Listbox.Label
                className={clsx(
                  'block text-sm font-semibold',
                  disabled ? labelDisabledColor : labelColor,
                )}
              >
                {label}
                {required && <span className="text-warning-600"> *</span>}
              </Listbox.Label>
              {!disabled && clearable && selected && !inline ? (
                <button
                  type="button"
                  className="text-xs focus:outline-none text-primary-600 focus:ring-1 focus:ring-primary-600 focus:ring-offset-1"
                  onClick={() => onSelect?.(undefined)}
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div ref={setReferenceElement} className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button
                  className={clsx(
                    'bg-white relative w-full border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm',
                    error ? inputError : inputColor,
                  )}
                >
                  <span className="block truncate">
                    {selected ? (
                      renderOption(selected)
                    ) : (
                      <span
                        className={
                          error ? 'text-danger-300' : 'text-neutral-400'
                        }
                      >
                        {placeholder}&nbsp;
                      </span>
                    )}
                  </span>

                  {!disabled && clearable && selected && inline && (
                    <div
                      className="absolute inset-y-0 flex items-center mr-2 cursor-pointer right-6"
                      onPointerUp={(event) => {
                        event.stopPropagation();
                        onSelect?.(undefined);
                      }}
                    >
                      <XIcon className="w-4 h-4 hover:text-neutral-500 text-neutral-400" />
                    </div>
                  )}

                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-neutral-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              {!disabled && (
                <Transition
                  show={open}
                  leave="transition-opacity ease-in duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute z-20 my-1 rounded-md shadow-lg"
                >
                  <div ref={setPopperElement} {...popperProps}>
                    <Listbox.Options
                      static
                      className="py-1 overflow-auto text-base bg-white rounded-md ring-1 ring-black ring-opacity-5 max-h-60 focus:outline-none sm:text-sm"
                    >
                      {options.map((option) => {
                        const value = getValue(option);
                        return (
                          <Listbox.Option key={value} value={value}>
                            {({ selected: isSelected, active }) => (
                              <div
                                className={clsx(
                                  active
                                    ? highlightClassName
                                    : 'text-neutral-900',
                                  'cursor-default select-none relative py-2 pl-8 pr-4',
                                )}
                              >
                                <span
                                  className={clsx(
                                    isSelected
                                      ? 'font-semibold'
                                      : 'font-normal',
                                    'block truncate',
                                  )}
                                >
                                  {renderOption(option)}
                                </span>
                                {isSelected && (
                                  <span
                                    className={clsx(
                                      active
                                        ? 'text-white'
                                        : 'text-primary-600',
                                      'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                    )}
                                  >
                                    <CheckIcon className="w-5 h-5" />
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        );
                      })}
                    </Listbox.Options>
                  </div>
                </Transition>
              )}
              {(error || help) && (
                <p
                  className={clsx('mt-2 text-sm text-neutral-500', {
                    'text-danger-600': error,
                  })}
                >
                  {error || help}
                </p>
              )}
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
