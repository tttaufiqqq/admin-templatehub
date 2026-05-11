import { createHmac, timingSafeEqual } from "node:crypto";

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret)
    .update(encodedPayload, "utf8")
    .digest("base64url");
}

export function buildSignedSessionToken(
  payload: SessionPayload,
  secret: string,
) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function parseSignedSessionToken(token: string, secret: string) {
  const [encodedPayload, receivedSignature] = token.split(".");

  if (!encodedPayload || !receivedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  const receivedBuffer = Buffer.from(receivedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(
      fromBase64Url(encodedPayload),
    ) as SessionPayload;

    if (
      typeof parsedPayload.userId !== "string" ||
      typeof parsedPayload.expiresAt !== "number"
    ) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}
