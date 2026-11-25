import { imageAudit } from "@/data/image-audit";

export type LabVariant = "a" | "b";
type AuditImage = (typeof imageAudit.images)[number];

export function LabImage({
  image,
  variant,
}: {
  image: AuditImage;
  variant: LabVariant;
}) {
  if (variant === "a") {
    return <img src={image.versionA.path} alt={image.alt} />;
  }

  const avif = image.versionB.avif.map((item) => `${item.path} ${item.width}w`).join(", ");
  const webp = image.versionB.webp.map((item) => `${item.path} ${item.width}w`).join(", ");
  const hero = image.slot === "hero";

  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={image.sizes} />
      <source type="image/webp" srcSet={webp} sizes={image.sizes} />
      <img
        src={image.versionB.fallback.path}
        alt={image.alt}
        width={image.versionA.width}
        height={image.versionA.height}
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : undefined}
        decoding={hero ? "sync" : "async"}
      />
    </picture>
  );
}

export function findImage(id: string) {
  const image = imageAudit.images.find((item) => item.id === id);
  if (!image) throw new Error(`Missing image ${id}`);
  return image;
}
