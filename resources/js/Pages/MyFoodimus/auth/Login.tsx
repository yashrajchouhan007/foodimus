import Button from "@/Components/foodimus/Button";
import React, { useEffect } from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import { useForm } from "@inertiajs/inertia-react";
import route from "ziggy-js";
import FoodimusPage from "@/Layouts/FoodimusPage";
import { GuestHeader } from "@/Partials/Headers";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import Grid from "@/Components/foodimus/Grid";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { H1 } from "@/Components/foodimus/typography/Headings";
import TextField from "@/Components/foodimus/TextField";
import svgCssIcon from "@/Helpers/svgCssIcon";
import { definition as faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";

import { Inertia } from "@inertiajs/inertia";
import Markdown from "@/Components/foodimus/Markdown";
import { useTranslation } from "react-i18next";
import useRoute from "@/Hooks/useRoute";
import GuestPage from "@/Layouts/GuestPage";
import { FlashProps } from "@/Partials/Flash";

const StyledContent = styled(Grid).attrs({
  cols: {
    "default": [1],
    tablet: [1, 1],
  },
  areas: {
    "default": [
      { name: "login", start: [0, 0] },
      { name: "signup", start: [0, 1] },
    ],
    tablet: [
      { name: "login", start: [0, 0] },
      { name: "signup", start: [1, 0] },
    ],
  },
})`
  ${headerContentWidth}
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 45px 20px 37px;
  gap: 20px;
`;
const StyledForm = styled.form`
  width: 100%;
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
  .forgot-password {
    font-size: 14px;
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.darkA80};
  }
  @media ${breakpoints.laptop} {
    width: 350px;
  }
`;
const StyledMarkdown = styled(Markdown)`
  font-size: 24px;
  line-height: 48px;
  ul > li {
    margin-left: 2.5em;
    :before {
      content: "";
      background: ${({ theme }) =>
        svgCssIcon(faCheckCircle, theme.colors.white)};
      background-repeat: no-repeat;
      display: inline-block;
      margin-left: -2.5em;
      min-width: 2.5em;
      height: 20px;
      position: relative;
      top: 4px;
    }
  }
`;
interface Props {
  status: string;
  canResetPassword: boolean;
  flash: FlashProps | null;
}
type Params = {
  email?: string;
};
export default function Login({ status, canResetPassword, flash }: Props) {
  const { t } = useTranslation("auth");
  const { params: _params } = useRoute();
  const params = _params as Params;
  const { data, setData, post, processing, errors, reset } = useForm({
    email: params.email || "",
    password: "",
    remember: "",
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(
      event.target.name as "email" | "password" | "remember",
      event.target.type === "checkbox"
        ? event.target.checked + ""
        : event.target.value
    );
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    post(route("login"));
  };
  return (
    <GuestPage modal={undefined} flash={flash}>
      <StyledContent>
        <StyledContainer>
          <H1>{t("login.form-login.title")}</H1>
          <StyledForm onSubmit={submit}>
            <TextField
              width="100%"
              height="47px"
              className="field"
              placeholder={t("login.form-login.email.label")}
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
              placeholder={t("login.form-login.password.label")}
              type="password"
              name="password"
              value={data.password}
              autoComplete="current-password"
              onChange={onHandleChange}
            />

            {status && <div>{status}</div>}

            {errors && (
              <ul className="errors">
                {Object.entries(errors).map(([_key, error], index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <Button color="red" disabled={processing}>
              {t("login.form-login.submit.label")}
            </Button>
            <div className="forgot-password">
              {canResetPassword && (
                <InertiaLink href={route("password.request")}>
                  {t("login.form-login.forgot-password.label")}
                </InertiaLink>
              )}
            </div>
          </StyledForm>
        </StyledContainer>
        <StyledContainer color="purple" textColor="white">
          <H1>{t("login.register.title")}</H1>
          <StyledMarkdown>{t("login.register.content")}</StyledMarkdown>
          <Button
            color="green"
            onClick={() => {
              Inertia.get(route("register"));
            }}
          >
            {t("login.register.button")}
          </Button>
        </StyledContainer>
      </StyledContent>
    </GuestPage>
  );
}
