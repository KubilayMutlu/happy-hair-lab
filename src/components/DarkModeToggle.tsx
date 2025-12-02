import React, { useEffect, useState } from 'react';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black transition"
    >
      {isDark ? 'Mode Clair' : 'Mode Sombre'}
    </button>
  );
};
export default DarkModeToggle;
