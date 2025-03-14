import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type SimpleToastType = 'info' | 'primary' | 'success' | 'warning' | 'error';

export interface SimpleToastProps {
  title?: string;
  children: ReactNode;
  type: SimpleToastType;
  show: boolean;
  onClose: () => void;
}

export const SimpleToast = ({ title, children, type = 'info', show, onClose }: SimpleToastProps) => {
  let Icon = ExclamationCircleIcon;

  switch (type) {
    case 'success':
      Icon = CheckCircleIcon;
      break;
    case 'warning':
      Icon = ExclamationTriangleIcon;
      break;
    case 'info':
    case 'primary':
    case 'error':
    default:
      Icon = ExclamationCircleIcon;
      break;
  }

  const liveNotifications = document.getElementById('live-notifications');

  return liveNotifications
    ? createPortal(
        <Transition
          as="div"
          appear={true}
          show={show}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="pointer-events-auto flex w-full max-w-xs items-start gap-x-3 overflow-hidden rounded-lg bg-white p-4 shadow-xl ring-1 ring-neutral-200"
        >
          <>
            <Icon
              className={clsx(
                type === 'info' ? 'text-neutral-600' : '',
                type === 'primary' ? 'text-blue-600' : '',
                type === 'success' ? 'text-green-600' : '',
                type === 'warning' ? 'text-yellow-600' : '',
                type === 'error' ? 'text-red-600' : '',
                'h-6 w-6'
              )}
              aria-hidden="true"
            />
            <div className="flex-1">
              {title ? <p className="text-sm font-semibold">{title}</p> : null}
              <p className="line-clamp-2 text-xs">{children}</p>
            </div>
            <button type="button" className="btn-secondary-filled btn-medium btn-icon" onClick={() => onClose()}>
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        </Transition>,
        liveNotifications
      )
    : null;
};
