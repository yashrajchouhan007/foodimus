import React from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import { DateTime } from "luxon";
import formatDate from "@/Helpers/formatDate";
import range from "@/Helpers/range";
import Select, { Option } from "./Select";
import { useTranslation } from "react-i18next";

const StyledFieldContainer = styled.div`
  display: flex;
  gap: 10px;
  .year {
    flex: 3;
  }
  .day {
    flex: 2;
  }
  .month {
    flex: 4;
  }
`;
type Value = {
  year?: number;
  month?: number;
  day?: number;
};
type Props = {
  minDate?: DateTime;
  maxDate?: DateTime;
};
type FormikProps = {
  name: string;
} & FieldHookConfig<Value>;

export const DateFormField = ({
  label,
  className,
  minDate,
  maxDate,
  disabled,
  required,
  validate,
  ...p
}: { label: React.ReactNode } & FormikProps & Props) => {
  const { t } = useTranslation();
  const [{ value }, meta, { setValue, setTouched }] = useField<Value>({
    validate: (value: Value) => {
      if (required && !(value?.year || value?.month || value?.day))
        return t("form.general.error.required") as string;
      if (!(value?.year && value?.month && value?.day))
        return t("form.date.error.incomplete") as string;
      const date = DateTime.fromObject(value);
      if (!date.isValid) return t("form.date.error.invalid") as string;
      if (maxDate && date > maxDate)
        return t("form.date.error.invalid") as string;
      if (minDate && date < minDate)
        return t("form.date.error.invalid") as string;
      if (validate) return validate(value);
    },
    ...p,
  });

  const sharedProps = {
    width: "100%",
    invalid: meta.touched && meta.error,
    disabled,
    onBlur: () => setTouched(true),
  };

  const maxYear = (maxDate || DateTime.now()).year;
  const minYear = minDate?.year || maxYear - 100;

  const setter =
    (field: "year" | "month" | "day") =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setValue({ ...value, [field]: Number(e.target.value) }, true);

  return (
    <label className={className}>
      {label}
      <StyledFieldContainer>
        {Array.from(t("form.date.fields-order", "mdy")).map((i, ix) => {
          switch (i) {
            case "m":
              return (
                <Select
                  key={ix}
                  onChange={setter("month")}
                  value={value?.month || ""}
                  className="month"
                  {...sharedProps}
                >
                  <Option value="" disabled />
                  {range(12).map((i) => (
                    <Option key={i} value={i + 1}>
                      {formatDate(t, DateTime.fromObject({ month: i + 1 }), {
                        month: "long",
                      })}
                    </Option>
                  ))}
                </Select>
              );
            case "d":
              return (
                <Select
                  key={ix}
                  onChange={setter("day")}
                  value={value?.day || ""}
                  className="day"
                  {...sharedProps}
                >
                  <Option value="" disabled />
                  {range(31).map((i) => (
                    <Option key={i} value={i + 1}>
                      {i + 1}
                    </Option>
                  ))}
                </Select>
              );
            case "y":
              return (
                <Select
                  key={ix}
                  onChange={setter("year")}
                  value={value?.year || ""}
                  className="year"
                  {...sharedProps}
                >
                  <Option value="" disabled />
                  {range(maxYear - minYear)
                    .map((i) => maxYear - i)
                    .map((i) => (
                      <Option key={i} value={i}>
                        {i}
                      </Option>
                    ))}
                </Select>
              );
          }
        })}
      </StyledFieldContainer>
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
