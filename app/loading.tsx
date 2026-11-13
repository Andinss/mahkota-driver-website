export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ln border-t-y"></div>
        <p className="text-mu font-medium animate-pulse">Memuat halaman...</p>
      </div>
    </div>
  );
}
