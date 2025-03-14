import clsx from 'clsx';
import { Resizable } from 're-resizable';
import { useEffect, useRef, useState } from 'react';
import { Form, Params, useLoaderData, useLocation, useSubmit } from 'react-router-dom';
import { CodeView, PreviewBreakpoints, PreviewGuide, PreviewToolbar, PreviewView } from '../../components';
import { Preview, getPreview } from '../../data';

export type PreviewViewType = 'preview' | 'code';

/**
 * Get the preview and navigation for the given category and preview ID parameters
 */
export async function loader({ request, params }: { request: Request; params: Params<string> }) {
  const url = new URL(request.url);
  const darkMode = url.searchParams.get('dark') === 'true';
  const showGridguide = url.searchParams.get('grid') === 'true';
  const width = url.searchParams.get('width');
  const { categoryId, previewId } = params;
  if (!categoryId || !previewId) throw new Error('Missing params');

  const [preview, navigation] = await getPreview(previewId, categoryId);

  // Return preview, dark mode and grid guide for this component,
  // and the navigation for the route handle to use in the breadcrumb
  return {
    preview,
    darkMode,
    showGridguide,
    width,
    navigation,
  };
}

export const Component = () => {
  const { preview, darkMode, showGridguide, width } = useLoaderData() as {
    preview: Preview;
    darkMode: boolean;
    showGridguide: boolean;
    width: string | null;
  };
  const resizable = useRef<Resizable>(null);
  const [guide, setGuide] = useState<{ show: boolean; width: string }>({
    show: false,
    width: '0px',
  });
  const [selectedWidth, setSelectedWidth] = useState<string>(width ?? '100%');
  const [selectedView, setSelectedView] = useState<PreviewViewType>('preview');
  const { pathname } = useLocation();
  const submit = useSubmit();

  const syncUrl = ({
    darkModeOverride = darkMode,
    showGridguideOverride = showGridguide,
    widthOverride = width,
  }: {
    darkModeOverride?: boolean;
    showGridguideOverride?: boolean;
    widthOverride?: string | null;
  }) => {
    submit(
      {
        ...(darkModeOverride ? { dark: 'true' } : {}),
        ...(showGridguideOverride ? { grid: 'true' } : {}),
        ...(widthOverride ? { width: widthOverride } : {}),
      },
      { action: pathname }
    );
  };

  // Resize the preview when a breakpoint is selected
  const handleBreakpointSelect = (width: string | null) => {
    if (width === selectedWidth) {
      width = null;
    }

    syncUrl({ widthOverride: width });
  };

  // Show the guide when a breakpoint is hovered over
  const handleBreakpointEnter = (width: string) => {
    setGuide({ show: true, width });
  };

  // Hide the guide when a breakpoint is no longer hovered over
  const handleBreakpointLeave = () => {
    setGuide({ show: false, width: '0px' });
  };

  // Disable the transition when resizing
  const handleResizeStart = () => {
    setSelectedWidth('100%');

    resizable.current?.resizable?.style.setProperty('transition-property', 'none');
  };

  // Re-enable the transition when resizing is complete
  const handleResizeStop = () => {
    const width = resizable.current?.state.width;

    syncUrl({ widthOverride: `${width}px` });

    resizable.current?.resizable?.style.setProperty('transition-property', 'all');
  };

  // Update the URL when the dark mode is toggled
  const handleDarkModeToggle = (darkMode: boolean) => {
    syncUrl({ darkModeOverride: darkMode });
  };

  // Update the URL when the grid guide is toggled
  const handleGridguideToggle = (showGridguide: boolean) => {
    syncUrl({ showGridguideOverride: showGridguide });
  };

  useEffect(() => {
    if (!resizable.current) {
      return;
    }

    const size = {
      width: width ?? '100%',
      height: resizable.current.state.height,
    };

    resizable.current.updateSize(size);
    setSelectedWidth(width ?? '100%');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div className="flex flex-1 flex-col">
      <Form>
        <PreviewToolbar
          pageUrl={preview.url}
          selectedView={selectedView}
          darkMode={darkMode}
          showGridguide={showGridguide}
          designUrl={preview.designUrl}
          onViewSelect={setSelectedView}
          onCopyToClipboard={() => {
            if (preview?.code) navigator.clipboard.writeText(preview.code);
          }}
          onDarkModeToggle={(darkMode) => handleDarkModeToggle(darkMode)}
          onGridguideToggle={(showGridguide) => handleGridguideToggle(showGridguide)}
        />
      </Form>

      <PreviewBreakpoints
        selectedView={selectedView}
        selectedWidth={selectedWidth}
        onBreakpointSelect={handleBreakpointSelect}
        onBreakpointEnter={handleBreakpointEnter}
        onBreakpointLeave={handleBreakpointLeave}
      />

      <div
        className={clsx(
          darkMode ? 'bg-slate-800' : 'bg-slate-100',
          'relative flex flex-1 flex-col rounded-lg ring-1 ring-slate-900/10 transition-colors dark:ring-white/10'
        )}
      >
        <PreviewView
          ref={resizable}
          pageUrl={preview.url}
          selectedView={selectedView}
          selectedWidth={selectedWidth}
          darkMode={darkMode}
          showGridguide={showGridguide}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />

        <CodeView code={preview?.code} selectedView={selectedView} />

        <PreviewGuide show={guide.show} width={guide.width} darkMode={darkMode} />
      </div>
    </div>
  );
};

Component.displayName = 'Preview';
