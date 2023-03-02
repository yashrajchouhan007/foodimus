import Button from "@/Components/foodimus/Button";
import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { RouteParams } from "ziggy-js";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { H1 } from "@/Components/foodimus/typography/Headings";
import TextField from "@/Components/foodimus/TextField";
import { useTranslation } from "react-i18next";
import { FlashProps } from "@/Partials/Flash";
import GuestPage from "@/Layouts/GuestPage";
import useRoute from "@/Hooks/useRoute";
import Switch from "@/Components/foodimus/Switch";
import Markdown from "@/Components/foodimus/Markdown";

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
  h1,
  .h1 {
    text-align: center;
  }
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
const TermsLabel = styled.label`
  display: flex;
  gap: 0.5em;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
`;
interface Props {
  token: string;
  email: string;
  flash: FlashProps | null;
}

export default function FinishAccount({ token, email, flash }: Props) {
  const { route, params: _params } = useRoute();
  const { referer, c } = _params as { referer?: string; c?: string };
  const { t } = useTranslation("auth");
  const [termsAgreed, setTermsAgreed] = useState(false);

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

    const p = referer || c ? ({} as { [k: string]: string }) : undefined;
    if (p && referer) p["referer"] = referer;
    if (p && c) p["c"] = c;
    post(route("finish-setup.store", p));
  };

  return (
    <GuestPage modal={undefined} flash={flash}>
      <StyledContent>
        <StyledContainer>
          <H1>{t("finish-account.form.title")}</H1>
          <StyledForm onSubmit={submit}>
            <TextField
              disabled
              width="100%"
              height="47px"
              className="field"
              placeholder={t("finish-account.form.email.label")}
              type="text"
              name="email"
              value={data.email || ""}
              autoComplete="username"
              isFocused={true}
              onChange={onHandleChange}
            />
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("finish-account.form.password.label")}
              type="password"
              name="password"
              value={data.password || ""}
              autoComplete="new-password"
              isFocused={true}
              onChange={onHandleChange}
            />
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("finish-account.form.password-confirmation.label")}
              type="password"
              name="password_confirmation"
              value={data.password_confirmation || ""}
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

            <TermsLabel>
              <Switch
                onChange={(checked) => {
                  setTermsAgreed(checked);
                }}
                checked={termsAgreed}
              />
              <Markdown linkAsAnchor>{t("add-payment.agree-terms")}</Markdown>
            </TermsLabel>
            <Button color="red" disabled={processing || !termsAgreed}>
              {t("finish-account.form.submit.label")}
            </Button>
          </StyledForm>
        </StyledContainer>
      </StyledContent>
    </GuestPage>
  );
}
