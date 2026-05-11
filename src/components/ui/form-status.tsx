import type { ReactNode } from "react";

import { StatusCard, type StatusTone } from "@/components/ui/status-card";

type FormStatusBannerProps = {
  title?: string;
  message: string;
  tone: StatusTone;
  children?: ReactNode;
};

function FormStatusBanner({
  title,
  message,
  tone,
  children,
}: FormStatusBannerProps) {
  return (
    <StatusCard message={message} title={title} tone={tone}>
      {children}
    </StatusCard>
  );
}

export function FormErrorBanner(props: Omit<FormStatusBannerProps, "tone">) {
  return <FormStatusBanner {...props} tone="error" />;
}

export function FormSuccessBanner(props: Omit<FormStatusBannerProps, "tone">) {
  return <FormStatusBanner {...props} tone="success" />;
}

export function InlineStatusBlock(props: FormStatusBannerProps) {
  return <FormStatusBanner {...props} />;
}
