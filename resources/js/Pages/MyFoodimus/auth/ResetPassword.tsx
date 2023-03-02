import Button from "@/Components/foodimus/Button";
import React, { useEffect } from "react";
import { useForm } from "@inertiajs/inertia-react";
import route from "ziggy-js";
import FoodimusPage from "@/Layouts/FoodimusPage";
import { GuestHeader } from "@/Partials/Headers";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { H1 } from "@/Components/foodimus/typography/Headings";
import TextField from "@/Components/foodimus/TextField";
import { useTranslation } from "react-i18next";
import { FlashProps } from "@/Partials/Flash";
import GuestPage from "@/Layouts/GuestPage";

const StyledContent = styled.div`
  ${headerContentWidth}
  display:flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  gap: 40px;
  @media ${breakpoints.tablet} {
    padding: 100px 0;
    gap: 40px;
  }
  @media ${breakpoints.laptop} {
    padding: 150px 40px;
    gap: 63px;
  }
`;

const StyledContainer = styled(RoundedBox)`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  padding: 45px 20px 37px;
  gap: 20px;
`;
const StyledForm = styled.form`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  .field {
    width: 100%;
  }
  .errors {
    color: ${({ theme }) => theme.colors.red};
    font-size: 16px;
    line-height: 20px;
  }
  .login {
    font-size: 14px;
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.darkA80};
  }
  @media ${breakpoints.laptop} {
    width: 350px;
  }
`;
interface Props {
  token: string;
  email: string;
  flash: FlashProps | null;
}

export default function ResetPassword({ token, email, flash }: Props) {
  const { t } = useTranslation("auth");

  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(
      event.target.name as
        | "email"
        | "password"
        | "password_confirmation"
        | "token",
      event.target.value
    );
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    post(route("password.update"));
  };

  return (
    <GuestPage flash={flash}>
      <StyledContent>
        <StyledContainer>
          <H1>{t("reset-password.form.title")}</H1>
          <StyledForm onSubmit={submit}>
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("reset-password.form.email.label")}
              type="text"
              name="email"
              value={data.email}
              autoComplete="username"
              isFocused={true}
              onChange={onHandleChange}
            />
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("reset-password.form.password.label")}
              type="password"
              name="password"
              value={data.password}
              autoComplete="new-password"
              isFocused={true}
              onChange={onHandleChange}
            />
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("reset-password.form.password-confirmation.label")}
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              autoComplete="new-password"
              isFocused={true}
              onChange={onHandleChange}
            />

            {errors && (
              <ul className="errors">
                {Object.entries(errors).map(([_key, error], index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <Button color="red" disabled={processing}>
              {t("reset-password.form.submit.label")}
            </Button>
          </StyledForm>
        </StyledContainer>
      </StyledContent>
    </GuestPage>
  );
}
