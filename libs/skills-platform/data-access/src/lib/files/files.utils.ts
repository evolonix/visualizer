// Download data to a file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadFile(content: string, fileName: string) {
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = fileName;

  // Append download link to the DOM and trigger a click to start the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up after the download is complete
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

export const createImportFileEventListener = ({
  fileImport,
  onImportLanguage,
}: {
  fileImport?: HTMLInputElement;
  onImportLanguage: (data: FormData) => void;
}) => {
  if (!fileImport) return undefined;

  const handlefileImport = async (e: Event) => {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);

      if (fileImport) fileImport.value = '';

      onImportLanguage(data);
    }
  };

  fileImport.addEventListener('change', handlefileImport);

  return () => {
    fileImport.removeEventListener('change', handlefileImport);
  };
};
