import { Transition } from '@headlessui/react';
import { Bars4Icon, ClipboardIcon, CodeBracketIcon, EyeIcon, EyeSlashIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { PreviewViewType } from '../../app/previews';

export const PreviewToolbar = ({
  pageUrl,
  selectedView,
  darkMode,
  showGridguide,
  designUrl,
  onViewSelect,
  onCopyToClipboard,
  onDarkModeToggle,
  onGridguideToggle,
}: {
  pageUrl?: string;
  selectedView: PreviewViewType;
  darkMode: boolean;
  showGridguide: boolean;
  designUrl?: string;
  onViewSelect: (view: PreviewViewType) => void;
  onCopyToClipboard: () => void;
  onDarkModeToggle: (darkMode: boolean) => void;
  onGridguideToggle: (showGridguide: boolean) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const generateFullscreenUrl = () => {
    const params = new URLSearchParams();

    if (darkMode) params.append('dark', 'true');
    if (showGridguide) params.append('grid', 'true');

    if (params.toString() === '') return pageUrl;

    return `${pageUrl}?${params.toString()}`;
  };

  const fullscreenUrl = generateFullscreenUrl();

  // Copy to Clipboard
  const handleCopyToClipboard = () => {
    setCopied(true);
    onCopyToClipboard();

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // Dark Mode
  const handleDarkModeToggle = () => {
    const dark = !darkMode;

    onDarkModeToggle(dark);
  };

  // Grid Guide
  const handleGridguideToggle = () => {
    const show = !showGridguide;

    onGridguideToggle(show);
  };

  return (
    <div className="z-10 mb-4 flex items-center justify-end py-2">
      {/* Design Link */}
      {designUrl ? (
        <a
          href={designUrl}
          target="_blank"
          rel="noreferrer"
          className="mr-3 inline-flex size-7 shrink-0 items-center justify-center rounded-md hover:ring-2 hover:ring-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:mr-6"
        >
          {/* Figma Logo */}
          <svg className="h-5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_137)">
              <path
                d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z"
                fill="#1ABCFE"
              />
              <path
                d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5H0Z"
                fill="#0ACF83"
              />
              <path
                d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0L19 0Z"
                fill="#FF7262"
              />
              <path
                d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5H0Z"
                fill="#F24E1E"
              />
              <path
                d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5H0Z"
                fill="#A259FF"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_137">
                <rect width="38" height="57" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="sr-only">Design File</span>
        </a>
      ) : null}

      {/* View Select */}
      <div className="flex space-x-1 rounded-lg bg-slate-200 p-0.5 dark:bg-slate-900" role="tablist" aria-orientation="horizontal">
        <button
          type="button"
          className={clsx(
            selectedView === 'preview' ? 'bg-white shadow' : '',
            'flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3'
          )}
          role="tab"
          aria-selected={selectedView === 'preview' ? 'true' : 'false'}
          tabIndex={selectedView === 'preview' ? 0 : -1}
          onClick={() => onViewSelect('preview')}
        >
          <EyeIcon
            className={clsx(selectedView === 'preview' ? 'stroke-sky-500' : 'stroke-slate-600 dark:stroke-slate-400', 'h-5 w-5 flex-none')}
          />
          <span className={clsx(selectedView === 'preview' ? 'text-slate-600' : '', 'sr-only lg:not-sr-only lg:ml-2')}>Preview</span>
        </button>
        <button
          type="button"
          className={clsx(
            selectedView === 'code' ? 'bg-white shadow' : '',
            'flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3'
          )}
          role="tab"
          aria-selected={selectedView === 'code' ? 'true' : 'false'}
          tabIndex={selectedView === 'code' ? 0 : -1}
          onClick={() => onViewSelect('code')}
        >
          <CodeBracketIcon
            className={clsx(selectedView === 'code' ? 'stroke-sky-500' : 'stroke-slate-600 dark:stroke-slate-400', 'h-5 w-5 flex-none')}
          />
          <span className={clsx(selectedView === 'code' ? 'text-slate-600' : '', 'sr-only lg:not-sr-only lg:ml-2')}>HTML</span>
        </button>
      </div>

      <div className="mx-3 h-5 w-px bg-slate-900/10 sm:mx-6 dark:bg-slate-50/20"></div>

      {/* Copy to Clipboard */}
      <button
        type="button"
        className="group relative inline-flex items-center rounded-md bg-sky-600 p-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:px-2.5 dark:shadow-black"
        onClick={handleCopyToClipboard}
      >
        <ClipboardIcon className="h-5 w-5" />
        <span className="sr-only lg:not-sr-only lg:ml-1.5">Copy HTML</span>

        <Transition
          show={copied}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bottom-full left-1/2 z-20 -ml-2 mb-2.5 flex -translate-x-1/2 justify-center">
            <div className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold uppercase leading-4 tracking-wide text-white drop-shadow-md filter dark:bg-slate-50 dark:text-slate-950">
              <svg aria-hidden="true" width="16" height="6" viewBox="0 0 16 6" className="absolute left-1/2 top-full -mt-px">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z"
                  className="fill-slate-900 dark:fill-slate-50"
                ></path>
              </svg>
              Copied!
            </div>
          </div>
        </Transition>
      </button>

      {/* Dark Mode */}
      <button
        type="button"
        className="group relative ml-2 inline-flex items-center rounded-md bg-sky-600 p-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:px-2.5 dark:shadow-black"
        onClick={handleDarkModeToggle}
      >
        {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        <span className="sr-only lg:not-sr-only lg:ml-1.5">{darkMode ? 'Light' : 'Dark'} Mode</span>
      </button>

      {/* Grid Guide */}
      <button
        type="button"
        className="group relative ml-2 inline-flex items-center rounded-md bg-sky-600 p-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:px-2.5 dark:shadow-black"
        onClick={handleGridguideToggle}
      >
        {showGridguide ? <EyeSlashIcon className="h-5 w-5" /> : <Bars4Icon className="h-5 w-5 rotate-90" />}
        <span className="sr-only lg:not-sr-only lg:ml-1.5">Grid Guide</span>
      </button>

      <div className="mx-3 h-5 w-px bg-slate-900/10 sm:mx-6 dark:bg-slate-50/20"></div>

      {/* Full Screen */}
      <a
        href={fullscreenUrl}
        className="inline-flex items-center rounded-md bg-sky-600 p-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:gap-x-1.5 lg:px-2.5 dark:shadow-black"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.75 20.25V14.3571H6.10714V17.8929H9.64286V20.25H3.75ZM3.75 9.64286V3.75H9.64286V6.10714H6.10714V9.64286H3.75ZM14.3571 20.25V17.8929H17.8929V14.3571H20.25V20.25H14.3571ZM17.8929 9.64286V6.10714H14.3571V3.75H20.25V9.64286H17.8929Z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only lg:not-sr-only">Full Screen</span>
      </a>
    </div>
  );
};
