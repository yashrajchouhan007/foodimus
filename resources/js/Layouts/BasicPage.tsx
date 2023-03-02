import { SmallHeader } from "@/Partials/Headers";
import React from "react";
import Foodimus from "./FoodimusPage";
import { Auth } from "@/Types/page-data";
import { FlashProps } from "@/Partials/Flash";

type Props = {
  auth?: Auth;
  modal?: React.ReactNode;
  children?: React.ReactNode;
  flash: FlashProps | null;
};
export const BasicPage = ({ modal, auth, children, flash }: Props) => (
  <Foodimus header={<SmallHeader auth={auth} />} flash={flash} modal={modal}>
    {children}
  </Foodimus>
);

export default BasicPage;
