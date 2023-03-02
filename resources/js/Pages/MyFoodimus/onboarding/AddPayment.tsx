import Button from "@/Components/foodimus/Button";
import React, { useState } from "react";
import FoodimusPage from "@/Layouts/FoodimusPage";
import { GuestHeader } from "@/Partials/Headers";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import styled, { css } from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { H1, H2, H3 } from "@/Components/foodimus/typography/Headings";
import { useTranslation } from "react-i18next";
import useStripeCardForm, {
  StripeCardFormProps,
  StripeProps,
} from "@/Hooks/useStripeCardForm";
import StripeContext from "@/Components/foodimus/StripeContext";
import Fill from "@/Components/foodimus/Fill";
import Markdown from "@/Components/foodimus/Markdown";
import Switch from "@/Components/foodimus/Switch";
import BodyText from "@/Components/foodimus/typography/BodyText";
import { FlashProps } from "@/Partials/Flash";
import GuestPage from "@/Layouts/GuestPage";
import ToggleButtonGroup from "@/Components/foodimus/ToggleButtonGroup";
import useRoute from "@/Hooks/useRoute";
import { Buffer } from "buffer";
import CardElement from "@/Components/foodimus/StripeCardElement";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import { ThemeColor } from "@/Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faStripe } from "@fortawesome/free-brands-svg-icons/faStripe";
import { definition as faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { definition as faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { definition as faCertificate } from "@fortawesome/free-solid-svg-icons/faCertificate";
import svgCssIcon from "@/Helpers/svgCssIcon";
import Separator from "@/Components/foodimus/Separator";
import formatCurrency from "@/Helpers/formatCurrency";
import { Auth, PaymentType, Prices } from "@/Types/page-data";
import AppExample from "@img/app-example.png";
import { hidePropsFromHtml } from "@/Helpers/hideProps";
import { Avatar as AvatarProps } from "@/Types/page-data";
import TextField from "@/Components/foodimus/TextField";

const StyledContent = styled.div`
  ${headerContentWidth}
  display:flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  gap: 40px;
  @media ${breakpoints.tablet} {
    padding: 60px 0;
    gap: 40px;
  }
  @media ${breakpoints.laptop} {
    padding: 60px 40px;
    gap: 63px;
  }
`;

const StyledBox = styled(RoundedBox)`
  width: 100%;
  padding: 45px 20px 37px;
  @media ${breakpoints.tablet} {
    padding: 60px 50px 37px;
  }
  @media ${breakpoints.laptop} {
    padding: 60px 60px 60px;
  }
`;
const StyledGridItem = styled(GridItem)<{
  align?: "center" | "stretch";
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align || "center"};
  justify-content: space-between;
  gap: 20px;
  h1,
  .h1 {
    text-align: center;
  }
`;
const StyledWarranty = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  color: ${({ theme }) =>
    (theme.colors as { [s in ThemeColor]: string }).lightGreyD20};
  font-size: 0.8em;
  & > .content > p {
    display: flex;
    gap: 0.3em;
  }
`;
const StyledForm = styled.form`
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 50px;
  button {
    align-self: center;
  }
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
  .middle-content {
    font-size: 0.7em;
    line-height: 1.1em;
  }
`;
const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  align-self: stretch;
  > label {
    flex: 1;
    justify-content: center;
  }
`;
const Label = styled.div`
  text-align: center;
`;

const LeftBarMarkdown = styled(Markdown)`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1em;
  ul > li {
    margin-left: 2.5em;
    margin-bottom: 0.5em;
    :before {
      content: "";
      background: ${({ theme }) =>
        svgCssIcon(faCheckCircle, theme.colors.purple)};
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
const AppExampleBox = styled.div.withConfig(hidePropsFromHtml("src"))<{
  src?: string;
}>`
  position: relative;
  left: -20px;
  width: 300px;
  height: 350px;
  transform-origin: 50% 90%;
  transform: scale(0.9);
  transition: transform 500ms ease-in-out;
  margin-bottom: 30px;
  &:hover {
    transform: scale(0.95);
  }
  &:before {
    content: "";
    background: url(${AppExample});
    background-size: contain;
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    z-index: 2;
  }
  ${({ src }) =>
    !!src &&
    css`
      &:after {
        content: "";
        background: url(${src});
        background-size: contain;
        display: block;
        position: absolute;
        top: 7%;
        left: 10%;
        height: 75%;
        width: 100%;
        background-repeat: no-repeat;
        background-position: left;
        z-index: 1;
        transition: transform 500ms ease-in-out;
        transform: translate(0, 0);
      }
      &:hover:after {
        transform: translate(-10px, 0);
      }
    `}
`;
const Testimonials = styled(Grid).attrs({
  cols: {
    "default": [1],
    tablet: [1, 1],
  },
})`
  gap: 30px 15px;
  width: 100%;
`;

const Avatar = styled.div.withConfig(hidePropsFromHtml("color", "flip"))<{
  color: ThemeColor;
  flip: boolean;
}>`
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme, color }) => theme.colors[color]};
  img {
    width: 100%;
  }
  ${({ flip }) => flip && `transform: scale(-1,1);`}

  width: 72px;
  height: 72px;
  @media ${breakpoints.tablet} {
    width: 100px;
    height: 100px;
  }
`;

const StyledTestimonalGrid = styled(Grid)`
  align-items: center;
  gap: 10px 20px;
  .text {
    align-self: flex-end;
  }
  .name {
    align-self: flex-start;
    font-weight: bold;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PersonalForm = styled(Grid)`
  gap: 20px;
  & > div > span {
    width: 100%;
    input {
      width: 100%;
    }
  }
`;
const Testimonial = ({ avatar, text, name }: TestimonialProps) => {
  return (
    <StyledTestimonalGrid
      {...{
        cols: ["auto", 1],
        rows: ["auto", "auto"],
        areas: [
          { name: "avatar", start: [0, 0], end: [0, 1] },
          { name: "text", start: [1, 0] },
          { name: "name", start: [1, 1] },
        ],
      }}
    >
      <GridItem className="avatar" area="avatar">
        <Avatar flip={avatar.orientation === "left"} color="yellow">
          <img src={avatar.src} />
        </Avatar>
      </GridItem>
      <GridItem className="text" area="text">
        <Markdown>{text}</Markdown>
      </GridItem>
      <GridItem className="name" area="name">
        {name}
      </GridItem>
    </StyledTestimonalGrid>
  );
};

type RedirectTarget = { redirect: string } | { redirectUrl: string };
type StripeFormProps = Omit<StripeCardFormProps, "internalRedirect"> & {
  redirectTarget: RedirectTarget;
  fixedPaymentType: PaymentType | null;
  defaultPaymentType: PaymentType;
  prices: Prices;
  auth?: Auth;
};
const StripeForm = ({
  redirectTarget,
  fixedPaymentType,
  defaultPaymentType,
  prices,
  auth,
  ...p
}: StripeFormProps) => {
  const { route } = useRoute();
  const hasFixedPaymentType = !!fixedPaymentType;
  const [paymentType, setPaymentType] = useState(
    (fixedPaymentType || defaultPaymentType) as PaymentType
  );
  const { stripe, busy, error, handleSubmit } = useStripeCardForm({
    ...p,
    internalRedirect: {
      success: route("subscription.subscribe", {
        ...redirectTarget,
        paymentType,
      }),
      error: route("setup-payment"),
    },
  });
  const { t } = useTranslation("auth");
  const formattedPrices = Object.fromEntries(
    Object.entries(prices).map(([k, v]) => [k, formatCurrency(t, v)])
  );
  const formattedPrice = formattedPrices[paymentType];

  return (
    <StyledForm onSubmit={handleSubmit}>
      {!hasFixedPaymentType && (
        <Section>
          <Markdown linkAsAnchor>{t("add-payment.plan.intro")}</Markdown>
          <StyledToggleButtonGroup
            value={paymentType}
            onChange={(value: PaymentType) => {
              setPaymentType(value);
            }}
          >
            {Object.entries(formattedPrices).map(([k, v]) => ({
              label: (
                <Label>
                  <Markdown>
                    {t(`add-payment.payment-type.${k}`, {
                      price: v,
                    })}
                  </Markdown>
                </Label>
              ),
              value: k,
            }))}
          </StyledToggleButtonGroup>
        </Section>
      )}
      <Section>
        <Markdown linkAsAnchor>{t("add-payment.personal.intro")}</Markdown>

        <PersonalForm
          areas={[
            { name: "firstname", start: [0, 0] },
            { name: "lastname", start: [1, 0] },
            { name: "email", start: [0, 1], end: [1, 1] },
          ]}
        >
          <GridItem area="firstname">
            <TextField disabled value={auth?.user.firstname} />
          </GridItem>
          <GridItem area="lastname">
            <TextField disabled value={auth?.user.lastname} />
          </GridItem>
          <GridItem area="email">
            <TextField disabled value={auth?.user.email} />
          </GridItem>
        </PersonalForm>
      </Section>
      <Section>
        <Markdown linkAsAnchor>{t("add-payment.payment.intro")}</Markdown>
        <CardElement />
        <Markdown linkAsAnchor className="middle-content">
          {t(`add-payment.middle-content.${paymentType}`, {
            price: formattedPrice,
          })}
        </Markdown>
      </Section>
      <Section>
        {error && <BodyText color="red">{error.message}</BodyText>}
        <Button color="red" disabled={!stripe || busy}>
          {t("add-payment.button-proceed")}
        </Button>
      </Section>
      <Section>
        <StyledWarranty>
          <FontAwesomeIcon className="logo" size="lg" icon={faLock} />
          <Markdown
            className="content"
            components={
              {
                //p: (p: any) => <div {...p} />,
                icon: ({ children }: { children: string[] }) => {
                  const [icon] = children;
                  switch (icon) {
                    case "stripe":
                      return <FontAwesomeIcon size="2x" icon={faStripe} />;
                  }
                  return <></>;
                },
              } as any
            }
          >
            {t("add-payment.warranty.stripe.top")}
          </Markdown>
        </StyledWarranty>
        <StyledWarranty>
          <FontAwesomeIcon className="logo" size="lg" icon={faCertificate} />
          <Markdown className="content">
            {t("add-payment.warranty.money-back.top")}
          </Markdown>
        </StyledWarranty>
      </Section>
    </StyledForm>
  );
};

//
//({ src }: { src?: string }) => {
//  return (
//    <div>
//      <img src={AppExample} width={350} />
//      {src && <img src={src} />}
//    </div>
//  );
//};
type TestimonialProps = {
  avatar: AvatarProps;
  name: string;
  text: string;
};
interface Props {
  flash: FlashProps | null;
  details: StripeProps;
  prices: Prices;
  appExampleBackground?: string;
  testimonials?: TestimonialProps[];
  auth?: Auth;
}

export default function FinishAccount({
  details: { publicKey, secret, billing },
  appExampleBackground,
  flash,
  testimonials,
  ...p
}: Props) {
  const { route, params: _params } = useRoute();
  const params = _params as { referer?: string; c?: string };
  let fixedPaymentType = null as null | PaymentType;
  let defaultPaymentType = "yearly" as PaymentType;
  if (params.c) {
    try {
      const config = JSON.parse(Buffer.from(params.c, "base64").toString());
      if (config.pp) fixedPaymentType = config.pp;
      if (config.dpp) defaultPaymentType = config.dpp;
    } catch (e) {}
  }
  const [leftTestimonial, ...bottomTestimonials] = testimonials || [];
  const { t } = useTranslation("auth");
  const redirectParam = {
    redirectUrl: route("redirect", {
      defaultUrl: route("search", { section: "meal-plan" }),
      ...(params.referer ? { referer: params.referer } : {}),
    }),
  } as RedirectTarget;
  return (
    <GuestPage flash={flash}>
      <StyledContent>
        <StyledBox>
          <Grid
            gap={{
              "default": "20px",
              tablet: "30px",
              laptop: "50px",
            }}
            cols={{ "default": [1], tablet: ["300px", 1], laptop: ["350px", 1] }}
            rows={{
              "default": ["auto", "auto", "auto", "auto"],
              tablet: ["auto", "auto", "auto", "auto", 1],
            }}
            areas={{
              "default": [
                { name: "top", start: [0, 0] },
                { name: "usps", start: [0, 1] },
                { name: "right", start: [0, 2] },
                { name: "testimonial", start: [0, 3] },
                { name: "app-detail", start: [0, 4] },
              ],
              tablet: [
                { name: "top", start: [0, 0], end: [1, 0] },
                { name: "app-detail", start: [0, 1] },
                { name: "usps", start: [0, 2] },
                { name: "testimonial", start: [0, 3] },
                { name: "right", start: [1, 1], end: [1, 4] },
              ],
            }}
          >
            <StyledGridItem area="top">
              <H1>{t("add-payment.form.title")}</H1>
              <Markdown>{t("add-payment.form.subtitle")}</Markdown>
            </StyledGridItem>
            <StyledGridItem area="app-detail" align="stretch">
              <AppExampleBox src={appExampleBackground} />
            </StyledGridItem>
            <StyledGridItem area="usps" align="stretch">
              <LeftBarMarkdown>{t("add-payment.form.left")}</LeftBarMarkdown>
            </StyledGridItem>
            {leftTestimonial && (
              <StyledGridItem area="testimonial" align="stretch">
                <Separator />
                <Testimonial {...leftTestimonial} />
              </StyledGridItem>
            )}
            <StyledGridItem area="right">
              <StripeContext publicKey={publicKey}>
                <StripeForm
                  {...p}
                  secret={secret}
                  billing={billing}
                  redirectTarget={redirectParam}
                  fixedPaymentType={fixedPaymentType}
                  defaultPaymentType={defaultPaymentType}
                />
              </StripeContext>
            </StyledGridItem>
          </Grid>
        </StyledBox>
        <Testimonials>
          {bottomTestimonials?.map((t, ix) => (
            <Testimonial key={ix} {...t} />
          ))}
        </Testimonials>
      </StyledContent>
    </GuestPage>
  );
}
