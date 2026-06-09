interface PlayStoreButtonProps {
  url: string;
}

export default function PlayStoreButton({ url }: PlayStoreButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary inline-flex items-center gap-2 min-h-[44px] min-w-[44px]"
      aria-label="Unduh di Google Play"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 12l2.302-2.492zM5.864 3.458L16.8 9.79l-2.302 2.302L5.864 3.458z" />
      </svg>
      <span>Unduh di Google Play</span>
    </a>
  );
}
