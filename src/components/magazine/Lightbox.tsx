/* Hộp xem ảnh của bản C. Được tách thành chunk riêng và chỉ tải khi người dùng bấm vào ảnh
   (React.lazy trong MagazinePageC). Markup và class giống hệt hộp xem ảnh của bản A. */
export type LightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 z-10 min-h-11 border border-paper px-4 text-sm text-paper"
        onClick={onClose}
      >
        Đóng
      </button>
      <img
        src={src}
        alt={alt}
        className="lightbox-photo relative"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
