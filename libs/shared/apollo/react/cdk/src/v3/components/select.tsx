import { useCallback, useRef } from 'react';

import { Listbox, ListboxButton, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export type SelectMode = 'small' | 'large';

export interface Option<T> {
  id: T;
  name: string;
}

export interface SelectProps<T> {
  id?: string;
  name?: string;
  options?: Option<T>[];
  value?: T | T[];
  disabledOptions?: T[];
  helperText?: string;
  errorText?: string;
  multiple?: boolean;
  className?: string;
  hasError?: boolean;
  mode?: SelectMode;
  /**
   * The id of the relative/absolute container that the select component is in.
   * This is used to adjust the position of the select component.
   */
  containerId?: string;
  disabled?: boolean;
  onChange?: (value: T | T[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

export function Select<T>({
  id,
  name,
  options,
  value,
  disabledOptions,
  helperText,
  errorText,
  multiple,
  className,
  hasError,
  mode,
  containerId,
  disabled,
  onChange,
  onBlur,
}: SelectProps<T>) {
  // Filter the options to only include those that are selected (if multiple is true) or the one that is selected (if multiple is false), denoted by the 'value' prop.
  const selectedOptions =
    options?.filter((option) => (Array.isArray(value) ? (value as T[])?.includes(option.id) : value === option.id)) || [];
  // Ensure that the selected value is an array if multiple is true, or a single value (or undefined) if multiple is false.
  const selectedValue = multiple ? selectedOptions : selectedOptions.length ? selectedOptions[0] : {};

  const handleChange = (selectedOptions: Option<T> | Option<T>[]) => {
    const value = multiple ? (selectedOptions as Option<T>[]).map((option) => option.id) : (selectedOptions as Option<T>).id;
    onChange?.(value);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const adjustListPosition = useCallback(() => {
    // If the list runs outside the container, move it to open above the button to prevent it from being cut off.
    let container = containerRef.current as HTMLElement | null; // inner div inside the select component
    const list = container?.querySelector('ul') as HTMLUListElement;

    if (!containerId) {
      list.classList.add('top-full');

      return;
    }

    let offsetTop = 0;

    // Traverse to find the relative/absolute container that has the id of 'containerId'
    while (container !== null && (container.id !== containerId || !container.offsetParent)) {
      offsetTop += container.offsetTop; // top relative to the closest relative/absolute parent
      container = container.offsetParent as HTMLElement | null; // The next closest relative/absolute parent
    }

    if (container !== null) {
      const listOffsetTop = offsetTop + list.offsetTop;
      const listOffsetHeight = list.offsetHeight;
      const outsideContainer = listOffsetTop + listOffsetHeight > container.offsetHeight;

      list.classList.toggle('top-full', !outsideContainer);
      list.classList.toggle('mb-2', outsideContainer);
      list.classList.toggle('bottom-full', outsideContainer);
    }
  }, [containerId]);

  return (
    <Listbox name={name || id} value={selectedValue} onChange={handleChange} multiple={multiple} disabled={disabled}>
      <div ref={containerRef} className={clsx('tw-relative tw-flex group', hasError || errorText ? 'tw-has-error' : '', className)}>
        <ListboxButton
          className={clsx(
            'tw-btn-secondary-outline group-[.has-error]:tw-bg-danger-50 group-[.has-error]:tw-border-danger-800 group-[.has-error]:tw-text-danger-800 focus:group-[.has-error]:tw-border-danger-800 tw-w-full tw-text-left',
            mode === 'large' ? 'tw-btn-medium' : ''
          )}
          title={selectedOptions?.map((option) => option.name).join(', ')}
          onBlur={onBlur}
        >
          <>
            <span className="tw-block tw-flex-1 tw-truncate">{selectedOptions?.[0]?.name || ''}</span>

            <b>{selectedOptions?.length > 1 ? ` +${selectedOptions?.length - 1}` : ''}</b>
            <ChevronUpDownIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          </>
        </ListboxButton>

        <Transition
          leave="tw-transition tw-duration-100 tw-ease-in"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
          beforeEnter={() => adjustListPosition()}
        >
          <Listbox.Options className="tw-absolute tw-z-10 tw-mt-1 tw-max-h-40 tw-w-full tw-overflow-auto tw-rounded-xl tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none sm:tw-text-sm">
            {options?.map((option) => (
              <Listbox.Option
                key={`${option.id}`}
                className={({ active, disabled }) =>
                  clsx(
                    active ? 'tw-bg-neutral-100 tw-text-neutral-900' : disabled ? 'tw-text-neutral-200' : 'tw-text-neutral-700',
                    multiple ? 'tw-pr-10' : 'tw-pr-4',
                    'tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-4'
                  )
                }
                value={option}
                disabled={disabledOptions?.includes(option.id)}
              >
                {({ selected, disabled }) => {
                  return (
                    <>
                      <span className={clsx(selected ? 'tw-font-semibold' : 'tw-font-normal', 'tw-block tw-truncate')}>{option.name}</span>

                      {multiple ? (
                        <span className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4">
                          <input
                            id={`${option.id}`}
                            name={`${option.id}`}
                            type="checkbox"
                            className="tw-h-4 tw-w-4 tw-rounded tw-border-neutral-200 tw-bg-neutral-100 tw-text-blue-600 focus:tw-ring-blue-600 disabled:tw-border-dashed"
                            readOnly
                            checked={selected}
                            disabled={disabled}
                          />
                        </span>
                      ) : null}
                    </>
                  );
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>

        <p className="tw-h-5 tw-text-xs tw-leading-5 tw-text-neutral-500 group-[.has-error]:tw-text-red-500 dark:tw-text-neutral-300 dark:group-[.has-error]:tw-text-red-300">
          {errorText || helperText}
        </p>
      </div>
    </Listbox>
  );
}
