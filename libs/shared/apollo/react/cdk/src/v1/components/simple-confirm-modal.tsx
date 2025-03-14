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
      <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={onCancel}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-600 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h4" className="font-extrabold text-neutral-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">{children}</div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button type="button" className="btn-primary btn-medium w-full sm:ml-3 sm:w-auto" onClick={() => onConfirm()}>
                    {confirmButtonText ?? 'Confirm'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-filled btn-medium mt-3 w-full sm:mt-0 sm:w-auto"
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
