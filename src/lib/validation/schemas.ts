import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const guestCheckoutBuyerSchema = z.object({
  fullName: z.string().trim().min(3, "Enter the buyer's full name.").max(120),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(160),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number or leave it blank.")
    .optional()
    .or(z.literal("")),
});

export const checkoutLineSchema = z.object({
  productId: z.string().uuid(),
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(25),
});

export const customerCheckoutBuyerSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number or leave it blank.")
    .optional()
    .or(z.literal("")),
});

export const checkoutPayloadSchema = z.object({
  sessionToken: z.string().min(1).max(120),
  buyer: customerCheckoutBuyerSchema,
  lines: z.array(checkoutLineSchema).min(1).max(25),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid admin email address.").max(160),
  password: z.string().trim().min(1, "Enter the admin password.").max(200),
});

export const customerSignUpSchema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phoneNumber: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number or leave it blank.")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password.")
    .max(200),
});

export const customerSignInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(160),
  password: z.string().min(1, "Enter your password.").max(200),
});

export const adminProductFormSchema = z.object({
  productId: z.string().uuid().optional(),
  name: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  categoryId: z.string().uuid(),
  shortDescription: z.string().trim().max(220).optional(),
  description: z.string().trim().min(10).max(6000),
  priceMajor: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price such as 49 or 49.90."),
  previewImagePath: z.string().trim().max(260).optional(),
  status: z.nativeEnum(ProductStatus),
  tagIds: z.array(z.string().uuid()).default([]),
  assetsText: z.string().trim().optional(),
});

export const adminOrderUpdateSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["awaiting_payment", "failed", "cancelled", "refunded"]),
  notes: z.string().trim().max(4000).optional(),
});

export const createBillPayloadSchema = z.object({
  publicOrderNo: z.string().trim().min(1).max(40),
});

export const callbackPayloadSchema = z.object({
  refno: z.string().trim().optional(),
  status: z.string().trim().min(1),
  reason: z.string().trim().optional(),
  billcode: z.string().trim().optional(),
  order_id: z.string().trim().optional(),
  amount: z.string().trim().optional(),
  transaction_time: z.string().trim().optional(),
  hash: z.string().trim().optional(),
  status_id: z.string().trim().optional(),
  msg: z.string().trim().optional(),
  transaction_id: z.string().trim().optional(),
  fpx_transaction_id: z.string().trim().optional(),
  dnqr_transaction_id: z.string().trim().optional(),
});

export const returnPayloadSchema = z.object({
  status_id: z.string().trim().min(1),
  billcode: z.string().trim().optional(),
  order_id: z.string().trim().optional(),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
export type GuestCheckoutBuyerInput = z.infer<typeof guestCheckoutBuyerSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>;
export type CustomerSignInInput = z.infer<typeof customerSignInSchema>;
export type CustomerCheckoutBuyerInput = z.infer<typeof customerCheckoutBuyerSchema>;
export type AdminProductFormInput = z.infer<typeof adminProductFormSchema>;
export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;
