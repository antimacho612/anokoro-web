/** マイコンピュータのアイコン。自作の図柄 */

export function FolderIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" aria-hidden="true">
      <path d="M1 4h11l3 3h16v19H1z" fill="#e8c048" stroke="#7a5a00" />
      {isOpen ? (
        <path d="M1 26l5-14h26l-5 14z" fill="#f8dc78" stroke="#7a5a00" />
      ) : (
        <path d="M1 9h30v17H1z" fill="#f8dc78" stroke="#7a5a00" />
      )}
    </svg>
  );
}

export function SampleFolderIcon() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" aria-hidden="true">
      <path d="M1 4h11l3 3h16v19H1z" fill="#78a8e0" stroke="#203f70" />
      <path d="M1 9h30v17H1z" fill="#a8ccf0" stroke="#203f70" />
      <path
        d="M16 11l2 4 4.5.5-3.3 3 1 4.4L16 20.6 11.8 23l1-4.4-3.3-3 4.5-.5z"
        fill="#fff36a"
        stroke="#806000"
      />
    </svg>
  );
}

export function PageIcon() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
      <path d="M1 1h16l8 8v20H1z" fill="#fff" stroke="#404040" />
      <path d="M17 1v8h8" fill="#d8d8d8" stroke="#404040" />
      <circle cx="9" cy="17" r="5" fill="#3a78d0" />
      <path d="M4 17h10M9 12c-3 3-3 7 0 10M9 12c3 3 3 7 0 10" stroke="#fff" fill="none" />
    </svg>
  );
}
