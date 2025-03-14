import clsx from 'clsx';
import { useEffect } from 'react';
import { Params, useLoaderData } from 'react-router-dom';
import { Preview, getPreview } from '../../data';
import { addGridGuides } from '../../lib';

/**
 * Get the preview for the given category and preview ID parameters
 */
export async function loader({ request, params }: { request: Request; params: Params<string> }) {
  const { categoryId, previewId } = params;
  const url = new URL(request.url);
  const darkMode = url.searchParams.get('dark') === 'true';
  const showGridguide = url.searchParams.get('grid') === 'true';
  if (!categoryId || !previewId) throw new Error('Missing params');

  const [preview] = await getPreview(previewId, categoryId);

  return { preview, darkMode, showGridguide };
}

export const Component = () => {
  const { preview, darkMode, showGridguide } = useLoaderData() as {
    preview: Preview;
    darkMode: boolean;
    showGridguide: boolean;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle the menu when ⌘ K or Ctrl K is pressed
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        if (window.top !== window.self) {
          // Dispatch the event on the parent window
          window.parent.document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
        }
      }
    };

    // Prevent links from navigating
    const handleLink = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);

    document.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', handleLink);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      document.querySelectorAll('a').forEach((a) => {
        a.removeEventListener('click', handleLink);
      });
    };
  }, []);

  useEffect(() => {
    if (showGridguide) {
      addGridGuides(document);
    }
  }, [showGridguide]);

  return preview.html ? (
    <div className={clsx('tw-h-full', darkMode ? 'dark' : '')} dangerouslySetInnerHTML={{ __html: preview.html }} />
  ) : null;
};

Component.displayName = 'Page';
