import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const LINKS = [
  { to: "/", label: "Phiếu bàn giao" },
  { to: "/ly-thuyet", label: "Cơ sở lý thuyết" },
  { to: "/phuong-phap", label: "Phương pháp" },
  { to: "/nhat-ky", label: "Nhật ký kỹ thuật" },
  { to: "/du-lieu", label: "Bảng dung lượng" },
  { to: "/phan-tich", label: "Phân tích" },
  { to: "/chat-luong", label: "Chất lượng ảnh" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="no-print border-b border-line bg-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <Link to="/" className="font-serif text-xl">
              Phố & Biển
            </Link>
            <p className="text-sm text-muted">Thành viên 1 · Tối ưu hình ảnh</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Hồ sơ">
            {LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    active
                      ? "shrink-0 border border-ink bg-ink px-3 py-2 text-sm text-paper"
                      : "shrink-0 border border-line px-3 py-2 text-sm text-ink"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}

export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm font-medium text-lacquer">{kicker}</p>
      <h1 className="mt-2 text-4xl leading-tight">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
    </header>
  );
}
