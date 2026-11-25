import { createFileRoute } from "@tanstack/react-router";
import { MagazinePage } from "@/components/magazine/MagazinePage";

export const Route = createFileRoute("/lab/a")({
  component: () => <MagazinePage variant="a" />,
  head: () => ({
    meta: [{ title: "Phố & Biển — phiên bản A" }],
  }),
});
