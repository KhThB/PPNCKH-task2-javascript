import { createFileRoute } from "@tanstack/react-router";
import { MagazinePageD } from "@/components/magazine/MagazinePageD";

export const Route = createFileRoute("/lab/d")({
  component: MagazinePageD,
  head: () => ({
    meta: [{ title: "Phố & Biển — phiên bản D" }],
  }),
});
