import clsx from 'clsx';
import Prism from 'prismjs';
import { PreviewViewType } from '../../app/previews';

export const CodeView = ({ code, selectedView }: { code?: string; selectedView: PreviewViewType }) => {
  return (
    <div className={clsx(selectedView === 'code' ? 'flex' : 'hidden', 'flex-1 overflow-hidden rounded-lg bg-slate-900 text-white')}>
      <pre className="flex flex-1 overflow-auto text-sm leading-[1.5714285714]">
        <code
          className="p-4"
          dangerouslySetInnerHTML={{
            __html: code ? Prism.highlight(code, Prism.languages.html, 'html') : '',
          }}
        ></code>
      </pre>
    </div>
  );
};
