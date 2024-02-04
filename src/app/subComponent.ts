import { ResponseType } from "@/openApiTypes";
import React from "react";

export interface SubComponentProps {
  // You probably want to abstract this type to `openApiTypes.ts`
  exchangeRate: ResponseType<"/currency/exchangerate", "get">;
}

export const SubComponent = ({
  exchangeRate: { base, date, rates },
}: SubComponentProps) => {
  return; /** */
};
