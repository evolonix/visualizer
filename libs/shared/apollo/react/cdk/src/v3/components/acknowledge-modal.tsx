import { useRef, useState } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export interface AcknowledgeModalProps {
  title: string;
  warningMessage?: string;
  message: string;
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AcknowledgeModal({ show, title, warningMessage, message, onCancel, onConfirm }: AcknowledgeModalProps) {
  const cancelButtonRef = useRef(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setAcknowledged(false);
  };

  const handleCancel = () => {
    onCancel();
    setAcknowledged(false);
  };

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
                    {warningMessage && (
                      <div className="tw-col-span-full tw-my-3 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-yellow-100 tw-pr-4 tw-text-yellow-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
                        <div className="tw-w-2 tw-self-stretch tw-bg-yellow-600"></div>
                        <ExclamationTriangleIcon className="tw-h-4 tw-w-9" />
                        <p className="tw-py-3 tw-text-xs tw-text-yellow-800">{warningMessage}</p>
                      </div>
                    )}
                    <div className="tw-mt-2">
                      <p className="tw-text-neutral-700">{message}</p>
                    </div>
                    <div className="tw-mt-5">
                      <input
                        id="acknowledge"
                        type="checkbox"
                        className="tw-h-4 tw-w-4 tw-rounded tw-border-neutral-200 tw-bg-neutral-100 tw-text-blue-600 focus:tw-ring-blue-600 disabled:tw-border-dashed"
                        checked={acknowledged}
                        onChange={() => setAcknowledged(!acknowledged)}
                      />
                      <label htmlFor="acknowledge" className="tw-ml-2 tw-text-neutral-700">
                        I acknowledge and accept the changes
                      </label>
                    </div>
                  </div>
                </div>
                <div className="tw-mt-5 sm:tw-mt-4 sm:tw-flex sm:tw-flex-row-reverse">
                  <button
                    type="button"
                    className="tw-btn-primary tw-btn-medium tw-w-full sm:tw-ml-3 sm:tw-w-auto"
                    onClick={() => handleConfirm()}
                    disabled={!acknowledged}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="tw-btn-secondary-filled tw-btn-medium tw-mt-3 tw-w-full sm:tw-mt-0 sm:tw-w-auto"
                    onClick={() => handleCancel()}
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
