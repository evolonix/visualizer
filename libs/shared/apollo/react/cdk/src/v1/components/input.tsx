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
    <div className={clsx('group relative z-0 w-full', errorText ? 'has-error' : '')}>
      {useTextArea ? (
        <textarea
          {...props}
          ref={textRef as React.RefObject<HTMLTextAreaElement>}
          className={clsx(
            'peer mt-4 block w-full appearance-none border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-1 text-neutral-800 placeholder-neutral-600 placeholder:opacity-0 focus:outline-none focus:ring-0 focus:placeholder:opacity-100 disabled:cursor-not-allowed disabled:border-dashed disabled:bg-neutral-100 group-[.has-error]:border-red-200 group-[.has-error]:text-red-800 group-[.has-error]:placeholder-red-600 focus:group-[.has-error]:border-red-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400 dark:disabled:bg-neutral-800 dark:group-[.has-error]:border-red-700 dark:group-[.has-error]:text-red-100 dark:group-[.has-error]:placeholder-red-400 dark:focus:group-[.has-error]:border-red-700 group-[.has-error]:[&:not(:focus)]:pr-6 focus:[&:not(:placeholder-shown)]:pr-6 group-hover:[&:not(:placeholder-shown)]:pr-6',
            color === 'purple'
              ? 'focus:border-blue-700 dark:focus:border-blue-600'
              : 'focus:border-purple-700 dark:focus:border-purple-600',
            mode === 'large' ? 'text-3xl font-bold' : '',
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
            'peer mt-4 block w-full appearance-none border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-1 text-neutral-800 placeholder-neutral-600 placeholder:opacity-0 focus:outline-none focus:ring-0 focus:placeholder:opacity-100 disabled:cursor-not-allowed disabled:border-dashed disabled:bg-neutral-100 group-[.has-error]:border-red-200 group-[.has-error]:text-red-800 group-[.has-error]:placeholder-red-600 focus:group-[.has-error]:border-red-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400 dark:disabled:bg-neutral-800 dark:group-[.has-error]:border-red-700 dark:group-[.has-error]:text-red-100 dark:group-[.has-error]:placeholder-red-400 dark:focus:group-[.has-error]:border-red-700 group-[.has-error]:[&:not(:focus)]:pr-6 focus:[&:not(:placeholder-shown)]:pr-6 group-hover:[&:not(:placeholder-shown)]:pr-6',
            color === 'purple'
              ? 'focus:border-blue-700 dark:focus:border-blue-600'
              : 'focus:border-purple-700 dark:focus:border-purple-600',
            mode === 'large' ? 'text-3xl font-bold' : '',
            props.className
          )}
          placeholder={props.placeholder || ' '} // Hack for :placeholder-shown to work correctly
        />
      )}

      <label
        htmlFor={props.id}
        className={clsx(
          'absolute top-1 origin-[0] -translate-y-5 transform text-xs font-semibold text-neutral-600 duration-300 group-hover:text-neutral-800 group-[.has-error]:text-red-600 group-hover:group-[.has-error]:text-red-800 peer-placeholder-shown:translate-y-0 peer-focus:left-0 peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:font-semibold group-[.has-error]:peer-focus:text-red-800 peer-disabled:cursor-not-allowed dark:text-neutral-300 dark:group-hover:text-neutral-200 dark:group-[.has-error]:text-red-400 dark:group-hover:group-[.has-error]:text-red-300 dark:group-[.has-error]:peer-focus:text-red-400',
          color === 'purple'
            ? 'peer-focus:text-blue-700 dark:peer-focus:text-blue-600'
            : 'peer-focus:text-purple-700 dark:peer-focus:text-purple-600',
          mode === 'large'
            ? 'peer-placeholder-shown:text-3xl peer-placeholder-shown:font-bold'
            : 'peer-placeholder-shown:text-base peer-placeholder-shown:font-normal'
        )}
      >
        {labelText}
        {props.required ? (
          <span aria-hidden="true" className="text-red-800">
            &nbsp;*
          </span>
        ) : null}
      </label>

      <button
        type="button"
        className="absolute bottom-5 right-0 top-0 z-10 hidden items-center focus:flex peer-focus:peer-[&:not(:placeholder-shown)]:flex group-hover:peer-enabled:peer-[&:not(:placeholder-shown)]:flex dark:text-neutral-300"
        onClick={resetField}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>

      <div className={clsx('pointer-events-none absolute bottom-5 right-0 top-0 items-center', props.disabled ? 'flex' : 'hidden')}>
        <LockClosedIcon className="h-4 w-4 text-neutral-600" />
      </div>

      <div className="pointer-events-none absolute bottom-5 right-0 top-0 hidden items-center group-hover:hidden group-[.has-error]:flex peer-focus:hidden peer-focus:peer-[&:not(:placeholder-shown)]:!hidden group-hover:peer-enabled:peer-[&:not(:placeholder-shown)]:!hidden">
        <ExclamationCircleIcon className="h-4 w-4 text-red-600" />
      </div>

      <p className="h-5 pt-1 text-xs text-neutral-600 group-[.has-error]:text-red-600 dark:text-neutral-300 dark:group-[.has-error]:text-red-300">
        <span className={clsx('length', helperText && props.disabled ? 'italic' : '')}>{errorText || helperText}</span>
        {props.maxLength && textLength > 100 ? (
          <span className="float-right">
            <span className="length">{props.value?.toString().length}</span>/{props.maxLength}
          </span>
        ) : null}
      </p>
    </div>
  );
};
