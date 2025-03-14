import { useRef } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

export interface SimpleConfirmModalProps {
  title: string;
  children: React.ReactNode;
  show: boolean;
  confirmButtonText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SimpleConfirmModal({ show, title, children, confirmButtonText, onCancel, onConfirm }: SimpleConfirmModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={show}>
      <Dialog as="div" className="tw-relative tw-z-[60]" initialFocus={cancelButtonRef} onClose={onCancel}>
        <TransitionChild
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-neutral-600 tw-bg-opacity-75 tw-transition-opacity" />
        </TransitionChild>

        <div className="tw-fixed tw-inset-0 tw-z-50 tw-overflow-y-auto">
          <div className="tw-flex tw-min-h-full tw-items-end tw-justify-center tw-p-4 tw-text-center sm:tw-items-center sm:tw-p-0">
            <TransitionChild
              enter="tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              enterTo="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leave="tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leaveTo="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
            >
              <DialogPanel className="tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-lg sm:tw-p-6">
                <div className="sm:tw-flex sm:tw-items-start">
                  <div className="tw-mt-3 tw-text-center sm:tw-ml-4 sm:tw-mt-0 sm:tw-text-left">
                    <Dialog.Title as="h4" className="tw-font-extrabold tw-text-neutral-900">
                      {title}
                    </Dialog.Title>
                    <div className="tw-mt-2">{children}</div>
                  </div>
                </div>
                <div className="tw-mt-5 sm:tw-mt-4 sm:tw-flex sm:tw-flex-row-reverse">
                  <button
                    type="button"
                    className="tw-btn-primary tw-btn-medium tw-w-full sm:tw-ml-3 sm:tw-w-auto"
                    onClick={() => onConfirm()}
                  >
                    {confirmButtonText ?? 'Confirm'}
                  </button>
                  <button
                    type="button"
                    className="tw-btn-secondary-filled tw-btn-medium tw-mt-3 tw-w-full sm:tw-mt-0 sm:tw-w-auto"
                    onClick={() => onCancel()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
