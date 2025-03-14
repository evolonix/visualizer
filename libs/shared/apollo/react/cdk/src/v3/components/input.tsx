import { useCallback, useRef } from 'react';

import { ExclamationCircleIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export type InputColor = 'blue' | 'purple';

export type InputMode = 'small' | 'large';

interface CustomInputProps {
  labelText: string;
  helperText?: string;
  errorText?: string;
  color?: InputColor;
  mode?: InputMode;
  rows?: number;
}

type HTMLInputProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, HTMLInputElement | HTMLTextAreaElement>,
  'rows'
>;

export type InputProps = HTMLInputProps & CustomInputProps;

function calculateNumLines(props: HTMLInputProps, rows?: number) {
  const numCharsPerLine = 100; // @todo - calculate num chars per line based on font and width of field
  const calculateNumLines = (text?: string) => {
    return (text || '').split(/\r\n|\r|\n/g).reduce((acc, line) => {
      return acc + Math.ceil(line.length / numCharsPerLine);
    }, 0);
  };
  // If > 1, the input will be a textarea
  const textLength = props.value?.toString().length || 0;
  const numRows = Math.max(calculateNumLines(props.value?.toString()), Math.ceil(textLength / numCharsPerLine)) || 1;
  // TODO: Use textLength to determine if we should use textarea, but it's not working correctly; see [PD-89568]
  const useTextArea = (rows || 1) > 1; //  || textLength > numCharsPerLine;

  return { numRows, useTextArea, textLength };
}

/**
 * Input field that is a input or textarea depending on the number of rows and other criteria
 *
 * React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
 * React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
 */
export const Input = ({ labelText, helperText, errorText, color, mode, rows, ...props }: InputProps) => {
  const textRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { numRows, useTextArea, textLength } = calculateNumLines(props, rows);

  const resetField = useCallback(
    // clear contents, validate, reset rows, and focus
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.id) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props.onChange?.({ target: { name: props.id, value: '' } } as any);

      const el = textRef.current;
      if (el && el instanceof HTMLTextAreaElement) {
        el.rows = 1;
      }

      el?.focus();
    },
    [textRef, props]
  );

  return (
    <div className={clsx('tw-relative tw-z-0 tw-w-full group', errorText ? 'has-error' : '')}>
      {useTextArea ? (
        <textarea
          {...props}
          ref={textRef as React.RefObject<HTMLTextAreaElement>}
          className={clsx(
            'tw-mt-4 tw-block tw-w-full tw-appearance-none tw-border-0 tw-border-b-2 tw-border-neutral-200 tw-bg-transparent tw-px-0 tw-py-1 tw-text-neutral-800 tw-placeholder-neutral-600 placeholder:tw-opacity-0 focus:tw-outline-none focus:tw-ring-0 focus:placeholder:tw-opacity-100 disabled:tw-cursor-not-allowed disabled:tw-border-dashed disabled:tw-bg-neutral-100 [.group.has-error_&]:tw-border-red-200 [.group.has-error_&]:tw-text-red-800 [.group.has-error_&]:tw-placeholder-red-600 focus:[.group.has-error_&]:tw-border-red-800 dark:tw-border-neutral-700 dark:tw-text-neutral-100 dark:tw-placeholder-neutral-400 dark:disabled:tw-bg-neutral-800 dark:[.group.has-error_&]:tw-border-red-700 dark:[.group.has-error_&]:tw-text-red-100 dark:[.group.has-error_&]:tw-placeholder-red-400 dark:focus:[.group.has-error_&]:tw-border-red-700 [.group.has-error_&]:[&:not(:focus)]:tw-pr-6 focus:[&:not(:placeholder-shown)]:tw-pr-6 group-hover:[&:not(:placeholder-shown)]:tw-pr-6 peer',
            color === 'purple'
              ? 'focus:tw-border-blue-700 dark:focus:tw-border-blue-600'
              : 'focus:tw-border-purple-700 dark:focus:tw-border-purple-600',
            mode === 'large' ? 'tw-text-3xl tw-font-bold' : '',
            props.className
          )}
          placeholder={props.placeholder || ' '} // Hack for :placeholder-shown to work correctly
          rows={numRows}
        ></textarea>
      ) : (
        <input
          {...props}
          ref={textRef as React.RefObject<HTMLInputElement>}
          className={clsx(
            'tw-mt-4 tw-block tw-w-full tw-appearance-none tw-border-0 tw-border-b-2 tw-border-neutral-200 tw-bg-transparent tw-px-0 tw-py-1 tw-text-neutral-800 tw-placeholder-neutral-600 placeholder:tw-opacity-0 focus:tw-outline-none focus:tw-ring-0 focus:placeholder:tw-opacity-100 disabled:tw-cursor-not-allowed disabled:tw-border-dashed disabled:tw-bg-neutral-100 [.group.has-error_&]:tw-border-red-200 [.group.has-error_&]:tw-text-red-800 [.group.has-error_&]:tw-placeholder-red-600 focus:[.group.has-error_&]:tw-border-red-800 dark:tw-border-neutral-700 dark:tw-text-neutral-100 dark:tw-placeholder-neutral-400 dark:disabled:tw-bg-neutral-800 dark:[.group.has-error_&]:tw-border-red-700 dark:[.group.has-error_&]:tw-text-red-100 dark:[.group.has-error_&]:tw-placeholder-red-400 dark:focus:[.group.has-error_&]:tw-border-red-700 [.group.has-error_&]:[&:not(:focus)]:tw-pr-6 focus:[&:not(:placeholder-shown)]:tw-pr-6 group-hover:[&:not(:placeholder-shown)]:tw-pr-6 peer',
            color === 'purple'
              ? 'focus:tw-border-blue-700 dark:focus:tw-border-blue-600'
              : 'focus:tw-border-purple-700 dark:focus:tw-border-purple-600',
            mode === 'large' ? 'tw-text-3xl tw-font-bold' : '',
            props.className
          )}
          placeholder={props.placeholder || ' '} // Hack for :placeholder-shown to work correctly
        />
      )}

      <label
        htmlFor={props.id}
        className={clsx(
          'tw-absolute tw-top-1 tw-origin-[0] -tw-translate-y-5 tw-transform tw-text-xs tw-font-semibold tw-text-neutral-600 tw-duration-300 group-hover:tw-text-neutral-800 [.group.has-error_&]:tw-text-red-600 group-hover:[.group.has-error_&]:tw-text-red-800 peer-placeholder-shown:tw-translate-y-0 peer-focus:tw-left-0 peer-focus:-tw-translate-y-5 peer-focus:tw-text-xs peer-focus:tw-font-semibold [.group.has-error_&]:peer-focus:tw-text-red-800 peer-disabled:tw-cursor-not-allowed dark:tw-text-neutral-300 dark:group-hover:tw-text-neutral-200 dark:[.group.has-error_&]:tw-text-red-400 dark:group-hover:[.group.has-error_&]:tw-text-red-300 dark:[.group.has-error_&]:peer-focus:tw-text-red-400',
          color === 'purple'
            ? 'peer-focus:tw-text-blue-700 dark:peer-focus:tw-text-blue-600'
            : 'peer-focus:tw-text-purple-700 dark:peer-focus:tw-text-purple-600',
          mode === 'large'
            ? 'peer-placeholder-shown:tw-text-3xl peer-placeholder-shown:tw-font-bold'
            : 'peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-font-normal'
        )}
      >
        {labelText}
        {props.required ? (
          <span aria-hidden="true" className="tw-text-red-800">
            &nbsp;*
          </span>
        ) : null}
      </label>

      <button
        type="button"
        className="tw-absolute tw-bottom-5 tw-right-0 tw-top-0 tw-z-10 tw-hidden tw-items-center focus:tw-flex peer-focus:[.peer:not(:placeholder-shown)_&]:tw-flex group-hover:peer-enabled:[.peer:not(:placeholder-shown)_&]:tw-flex dark:tw-text-neutral-300"
        onClick={resetField}
      >
        <XMarkIcon className="tw-h-4 tw-w-4" />
      </button>

      <div
        className={clsx(
          'tw-pointer-events-none tw-absolute tw-bottom-5 tw-right-0 tw-top-0 tw-items-center',
          props.disabled ? 'tw-flex' : 'tw-hidden'
        )}
      >
        <LockClosedIcon className="tw-h-4 tw-w-4 tw-text-neutral-600" />
      </div>

      <div className="tw-pointer-events-none tw-absolute tw-bottom-5 tw-right-0 tw-top-0 tw-hidden tw-items-center group-hover:tw-hidden [.group.has-error_&]:tw-flex peer-focus:tw-hidden peer-focus:[.peer:not(:placeholder-shown)_&]:tw-!hidden group-hover:peer-enabled:[.peer:not(:placeholder-shown)_&]:tw-!hidden">
        <ExclamationCircleIcon className="tw-h-4 tw-w-4 tw-text-red-600" />
      </div>

      <p className="tw-h-5 tw-pt-1 tw-text-xs tw-text-neutral-600 [.group.has-error_&]:tw-text-red-600 dark:tw-text-neutral-300 dark:[.group.has-error_&]:tw-text-red-300">
        <span className={clsx(helperText && props.disabled ? 'tw-italic' : '')}>{errorText || helperText}</span>
        {props.maxLength && textLength > 100 ? (
          <span className="tw-float-right">
            <span>{props.value?.toString().length}</span>/{props.maxLength}
          </span>
        ) : null}
      </p>
    </div>
  );
};
