import Link from "next/link";

import { logoutAdminAction } from "@/app/admin/actions";
import { StatusCard } from "@/components/ui/status-card";
import { getSuccessNotice } from "@/lib/status/success";

type AdminShellProps = {
  title: string;
  eyebrow: string;
  description: string;
  currentPath: "/admin" | "/admin/products" | "/admin/orders" | "/admin/payments";
  adminUser: {
    fullName: string;
    email: string;
  };
  notice?: string | null;
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payment Events" },
] as const;

function formatNoticeMessage(notice: string | null | undefined) {
  return getSuccessNotice(notice?.replaceAll("-", "_") ?? null);
}

export function AdminShell({
  title,
  eyebrow,
  description,
  currentPath,
  adminUser,
  notice,
  children,
}: AdminShellProps) {
  const noticeMessage = formatNoticeMessage(notice);

  return (
    <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)]">
      <header className="brand-gradient-hero border-b border-[color:var(--color-brand-border)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                {description}
              </p>
            </div>
            <div className="border border-white/18 bg-white/10 p-5 backdrop-blur lg:min-w-[260px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Signed in
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                {adminUser.fullName}
              </p>
              <p className="mt-2 text-sm text-white/76">{adminUser.email}</p>
              <form action={logoutAdminAction} className="mt-5">
                <button
                  className="inline-flex items-center justify-center border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/10"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => {
              const isCurrent = item.href === currentPath;

              return (
                <Link
                  key={item.href}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                    isCurrent
                      ? "bg-white text-[var(--color-brand-primary)]"
                      : "border border-white/18 text-white hover:bg-white/10"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        {noticeMessage ? (
          <StatusCard
            className="mb-6 bg-white/80"
            message={noticeMessage.message}
            title="Success"
            tone={noticeMessage.tone ?? "success"}
          />
        ) : null}

        {children}
      </main>
    </div>
  );
}
