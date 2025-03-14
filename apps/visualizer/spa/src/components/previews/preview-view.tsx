import clsx from 'clsx';
import { Resizable } from 're-resizable';
import { ForwardedRef, RefObject, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { PreviewViewType } from '../../app/previews';
import { addGridGuides, removeGridGuides } from '../../lib';
import { breakpoints } from '../../lib/breakpoints';
import { useBreakpointObserver } from '../../lib/use-breakpoint-observer';
import { PreviewSkeleton } from './preview.skeleton';

interface PreviewProps {
  pageUrl?: string;
  selectedView: PreviewViewType;
  selectedWidth: string | number;
  darkMode: boolean;
  showGridguide: boolean;
  onResizeStart: () => void;
  onResizeStop: () => void;
}

export const PreviewView = forwardRef(
  (
    { pageUrl, selectedView, selectedWidth, darkMode, showGridguide, onResizeStart, onResizeStop }: PreviewProps,
    forwardedRef: ForwardedRef<Resizable>
  ) => {
    const isSmallScreen = useBreakpointObserver(breakpoints['sm']);
    const [loading, setLoading] = useState(true);
    const iframe = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // Reset to full width on x-small screens since resizable is disabled for x-small screens
      if (!isSmallScreen) {
        (forwardedRef as RefObject<Resizable>)?.current?.updateSize({
          width: '100%',
          height: '100%',
        });
      }
    }, [forwardedRef, isSmallScreen]);

    useEffect(() => {
      // Show loading skeleton while the iframe is loading
      setLoading(true);

      // Hide the loading skeleton if the iframe fails to load
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }, [pageUrl]);

    // Toggle dark mode on the iframe
    const toggleDarkMode = useCallback(
      () => iframe.current?.contentDocument?.documentElement.classList.toggle('dark', darkMode),
      [darkMode]
    );

    // Toggle the grid guide on the iframe
    const toggleGridguide = useCallback(() => {
      const iframeDocument = iframe.current?.contentDocument;
      if (!iframeDocument) return;

      if (showGridguide) {
        addGridGuides(iframeDocument);
      } else {
        removeGridGuides(iframeDocument);
      }
    }, [showGridguide]);

    useEffect(() => {
      toggleDarkMode();
    }, [darkMode, toggleDarkMode]);

    useEffect(() => {
      toggleGridguide();
    }, [showGridguide, toggleGridguide]);

    return (
      <Resizable
        ref={forwardedRef}
        className={clsx(
          selectedView === 'preview' ? 'flex' : 'hidden',
          'sm:min-w-xs relative min-h-[640px] max-w-full flex-1 flex-col rounded-lg ring-1 ring-slate-900/10 transition-all duration-300'
        )}
        defaultSize={{
          width: selectedWidth,
          height: '100%',
        }}
        enable={{
          right: isSmallScreen,
          left: false,
          top: false,
          bottom: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={{
          right: {
            cursor: 'ew-resize',
          },
        }}
        handleComponent={{
          right: (
            <div className="group absolute inset-y-0 left-full hidden cursor-ew-resize items-center px-2 sm:flex">
              <div
                className={clsx(
                  darkMode
                    ? 'bg-slate-500 group-hover:bg-slate-400 group-active:bg-slate-400'
                    : 'bg-slate-400 group-hover:bg-slate-500 group-active:bg-slate-500',
                  'h-8 w-1.5 rounded-full transition-colors'
                )}
              ></div>
            </div>
          ),
        }}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
      >
        <iframe
          ref={iframe}
          title="preview"
          src={pageUrl}
          className="w-full flex-1 rounded-lg"
          onLoad={() => {
            setTimeout(() => {
              toggleDarkMode();
              toggleGridguide();
              setLoading(false);
            }, 500);
          }}
        ></iframe>

        <PreviewSkeleton show={loading} darkMode={darkMode} />
      </Resizable>
    );
  }
);
