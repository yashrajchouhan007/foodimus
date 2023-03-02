import React from "react";
import { Auth } from "@/Types/page-data";
import { FlashProps } from "@/Partials/Flash";
import BasicPage from "./BasicPage";
import GuestPage from "./GuestPage";

type Props = {
  auth?: Auth;
  modal: React.ReactNode;
  children?: React.ReactNode;
  flash: FlashProps | null;
};
export const OptionalAuthPage = (p: Props) =>
  p.auth?.user ? <BasicPage {...p} /> : <GuestPage {...p} footer={true} />;

export default OptionalAuthPage;
