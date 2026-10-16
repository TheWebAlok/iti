import { useEffect, useState } from 'react';

/** Returns 'dark' or 'light' by watching <html class="dark">. Used to theme MagicBento. */
export default function useSiteTheme() {
  const read = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}