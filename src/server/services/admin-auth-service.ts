import { UserRole, UserStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { ConfigAppError } from "@/lib/status/app-error";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { verifyPasswordHash } from "@/server/services/auth-crypto";
import {
  buildSignedSessionToken,
  parseSignedSessionToken,
} from "@/server/services/session-token";

const ADMIN_SESSION_COOKIE = "templatehub_admin_session";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getAdminSessionSecret() {
  const explicitSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (explicitSecret) {
    return explicitSecret;
  }

  const fallbackSecret = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();

  if (fallbackSecret) {
    return fallbackSecret;
  }

  throw new ConfigAppError(
    "ADMIN_SESSION_SECRET or ADMIN_BOOTSTRAP_PASSWORD must be configured before admin auth can run.",
  );
}

export async function setAdminSessionCookie(userId: string) {
  const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  const token = buildSignedSessionToken(
    { userId, expiresAt },
    getAdminSessionSecret(),
  );
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  const sessionPayload = parseSignedSessionToken(
    sessionCookie,
    getAdminSessionSecret(),
  );

  if (!sessionPayload || sessionPayload.expiresAt <= Date.now()) {
    await clearAdminSessionCookie();
    return null;
  }

  const adminUser = await prisma.appUser.findFirst({
    where: {
      id: sessionPayload.userId,
      role: UserRole.admin,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      lastLoginAt: true,
    },
  });

  if (!adminUser) {
    await clearAdminSessionCookie();
    return null;
  }

  return adminUser;
}

export async function requireAdminUser() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/login?error=auth-required");
  }

  return adminUser;
}

export async function loginAdminUser(input: {
  email: string;
  password: string;
}) {
  const parsedInput = adminLoginSchema.parse(input);
  const adminUser = await prisma.appUser.findFirst({
    where: {
      email: parsedInput.email.trim().toLowerCase(),
      role: UserRole.admin,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      fullName: true,
    },
  });

  if (
    !adminUser ||
    !verifyPasswordHash(parsedInput.password, adminUser.passwordHash)
  ) {
    return {
      ok: false as const,
      code: "invalid_credentials",
    };
  }

  await prisma.appUser.update({
    where: {
      id: adminUser.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  await setAdminSessionCookie(adminUser.id);

  return {
    ok: true as const,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      fullName: adminUser.fullName,
    },
  };
}
