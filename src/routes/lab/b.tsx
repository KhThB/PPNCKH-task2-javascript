import { createFileRoute } from "@tanstack/react-router";
import { MagazinePage } from "@/components/magazine/MagazinePage";

export const Route = createFileRoute("/lab/b")({
  component: () => <MagazinePage variant="b" />,
  head: () => ({
    meta: [{ title: "Phố & Biển — phiên bản B" }],
  }),
});
