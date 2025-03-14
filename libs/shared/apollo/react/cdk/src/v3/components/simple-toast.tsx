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
          enter="tw-transform tw-ease-out tw-duration-300 tw-transition"
          enterFrom="tw-translate-y-2 tw-opacity-0 sm:tw-translate-y-0 sm:tw-translate-x-2"
          enterTo="tw-translate-y-0 tw-opacity-100 sm:tw-translate-x-0"
          leave="tw-transition tw-ease-in tw-duration-100"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
          className="tw-pointer-events-auto tw-flex tw-w-full tw-max-w-xs tw-items-start tw-gap-x-3 tw-overflow-hidden tw-rounded-lg tw-bg-white tw-p-4 tw-shadow-xl tw-ring-1 tw-ring-neutral-200"
        >
          <>
            <Icon
              className={clsx(
                type === 'info' ? 'tw-text-neutral-600' : '',
                type === 'primary' ? 'tw-text-blue-600' : '',
                type === 'success' ? 'tw-text-green-600' : '',
                type === 'warning' ? 'tw-text-yellow-600' : '',
                type === 'error' ? 'tw-text-red-600' : '',
                'tw-h-6 tw-w-6'
              )}
              aria-hidden="true"
            />
            <div className="tw-flex-1">
              {title ? <p className="tw-text-sm tw-font-semibold">{title}</p> : null}
              <p className="tw-line-clamp-2 tw-text-xs">{children}</p>
            </div>
            <button type="button" className="tw-btn-secondary-filled tw-btn-medium tw-btn-icon" onClick={() => onClose()}>
              <XMarkIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
            </button>
          </>
        </Transition>,
        liveNotifications
      )
    : null;
};
