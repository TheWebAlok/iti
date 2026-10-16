// Helpers to view, download and print a notice file that was fetched as a Blob.

export const viewBlob = (blob, win) => {
  const url = URL.createObjectURL(blob);
  // "win" is a tab opened on click (before the fetch) so the browser does not block the popup.
  if (win) win.location.href = url;
  else window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

export const printBlob = (blob) => {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  iframe.src = url;
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    // Keep the frame a while so the print dialog can finish.
    setTimeout(() => {
      iframe.remove();
      URL.revokeObjectURL(url);
    }, 60000);
  };
  document.body.appendChild(iframe);
};