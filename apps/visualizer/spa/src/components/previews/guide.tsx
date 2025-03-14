import { Transition } from '@headlessui/react';
import clsx from 'clsx';

export const PreviewGuide = ({ show, width, darkMode }: { show: boolean; width: string; darkMode: boolean }) => {
  return (
    <Transition
      as="div"
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={clsx(darkMode ? 'bg-white/20' : 'bg-slate-900/20', 'absolute inset-0 rounded-l-lg transition-colors')}
      style={{ width }}
    >
      <div
        className="absolute -bottom-4 -right-px top-1 border-r-2 border-dashed border-red-500 dark:border-red-400"
        hidden={width === '0px'}
      ></div>
    </Transition>
  );
};
