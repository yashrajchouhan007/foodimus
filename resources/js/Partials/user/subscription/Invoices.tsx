import React from "react";
import { useTranslation } from "react-i18next";
import { LinkButton } from "@/Components/foodimus/Button";
import { Invoice } from "@/Types/stripe";
import formatDate from "@/Helpers/formatDate";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faFileInvoice } from "@fortawesome/free-solid-svg-icons/faFileInvoice";

export type InvoiceData = Invoice & {
  props: { date: string; total: string };
  status: string;
};

export const Invoices = ({ invoices }: { invoices: InvoiceData[] }) => {
  const { t } = useTranslation("settings");
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>{t("form.invoices.thead.number")}</th>
            <th>{t("form.invoices.thead.date")}</th>
            <th>{t("form.invoices.thead.total")}</th>
            <th>{t("form.invoices.thead.status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: InvoiceData) => (
            <tr key={invoice.id}>
              <td>{invoice.number}</td>
              <td>
                {formatDate(t, DateTime.fromISO(invoice.props.date), {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </td>
              <td>{invoice.props.total}</td>
              <td>
                <span>{invoice.status}</span>
              </td>
              <td>
                {invoice.hosted_invoice_url && (
                  <LinkButton
                    size="md"
                    external
                    variant="ghost"
                    href={invoice.hosted_invoice_url}
                  >
                    <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
                  </LinkButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Invoices;
