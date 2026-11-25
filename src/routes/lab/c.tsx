import { createFileRoute } from "@tanstack/react-router";
import { MagazinePageC } from "@/components/magazine/MagazinePageC";

export const Route = createFileRoute("/lab/c")({
  component: MagazinePageC,
  head: () => ({
    meta: [{ title: "Phố & Biển — phiên bản C" }],
  }),
});
