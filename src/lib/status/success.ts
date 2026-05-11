export type SuccessNoticeTone = "success" | "info";

export type SuccessNoticeDefinition = {
  code: string;
  message: string;
  tone?: SuccessNoticeTone;
};

export const successNoticeCatalog = {
  checkout_created: {
    code: "checkout_created",
    message: "Your order was saved successfully.",
    tone: "success",
  },
  download_ready: {
    code: "download_ready",
    message: "Your downloads are ready to access.",
    tone: "success",
  },
  order_updated: {
    code: "order_updated",
    message: "The order review update was saved successfully.",
    tone: "success",
  },
  payment_confirmed: {
    code: "payment_confirmed",
    message: "Payment was confirmed successfully.",
    tone: "success",
  },
  payment_link_created: {
    code: "payment_link_created",
    message: "A fresh payment link is ready.",
    tone: "success",
  },
  product_created: {
    code: "product_created",
    message: "The product record was created successfully.",
    tone: "success",
  },
  product_updated: {
    code: "product_updated",
    message: "The product details were saved successfully.",
    tone: "success",
  },
  signed_in: {
    code: "signed_in",
    message: "Admin session opened successfully.",
    tone: "success",
  },
  signed_out: {
    code: "signed_out",
    message: "The admin session has been closed.",
    tone: "info",
  },
  status_updated: {
    code: "status_updated",
    message: "The product publishing state was updated successfully.",
    tone: "success",
  },
} satisfies Record<string, SuccessNoticeDefinition>;

export type SuccessNoticeCode = keyof typeof successNoticeCatalog;

export function getSuccessNotice(code: string | null | undefined) {
  if (!code) {
    return null;
  }

  return successNoticeCatalog[code as SuccessNoticeCode] ?? null;
}
