import React from "react";
import styled from "styled-components";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import Separator from "@/Components/foodimus/Separator";
import LogoSvg from "-!react-svg-loader!@img/logo.svg";
import breakpoints from "@/Theme/breakpoints";
import { ThemeColor } from "@/Theme";
import { definition as faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { definition as faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF";

import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { useTablet } from "@/Hooks/useMedia";
import { H3 } from "@/Components/foodimus/typography/Headings";
import headerContentWidth from "@/Theme/headerContentWidth";
import { useTranslation } from "react-i18next";
import IconButton from "@/Components/foodimus/IconButton";
import useRoute from "@/Hooks/useRoute";
import { DateTime } from "luxon";
import { InertiaLink } from "@inertiajs/inertia-react";

const separatorColor: ThemeColor = "purpleA30";

const StyledContainer = styled(Grid).attrs<React.ComponentProps<typeof Grid>>(
  (p) => ({
    cols: {
      "default": ["auto"],
      tablet: ["auto", 1, "auto", "auto", "auto"],
    },
    rows: {
      "default": ["auto"],
      tablet: [1, "auto", "auto"],
    },
    areas: p.areas || {
      "default": [
        { name: "logo", start: [0, 0] },
        { name: "landings", start: [0, 1] },
        { name: "about", start: [0, 2] },
        { name: "social", start: [0, 3] },
        { name: "terms", start: [0, 4] },
        { name: "separator", start: [0, 5] },
        { name: "copyright", start: [0, 6] },
      ],
      tablet: [
        { name: "logo", start: [0, 0] },
        { name: "landings", start: [2, 0] },
        { name: "about", start: [3, 0] },
        { name: "social", start: [4, 0] },
        { name: "separator", start: [0, 1], end: [4, 1] },
        { name: "terms", start: [3, 2], end: [4, 2] },
        { name: "copyright", start: [0, 2], end: [2, 2] },
      ],
    },
  })
)`
  border-top: solid thin ${({ theme }) => theme.colors[separatorColor]};
  ${headerContentWidth}
  padding-top: 40px;
  gap: 20px;
  @media ${breakpoints.tablet} {
    gap: 28px;
    min-height: 280px;
  }
`;
const Logo = styled(LogoSvg)`
  width: 123px;
  color: ${({ theme }) => theme.colors.purple};
  margin-bottom: 5px;
`;
const SectionHeader = styled(H3).attrs(() => ({ as: "div", color: "purple" }))`
  display: none;
  margin-bottom: 10px;
  @media ${breakpoints.tablet} {
    display: initial;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  @media ${breakpoints.tablet} {
    width: 172px;
  }
  @media ${breakpoints.desktop} {
    width: 172px;
  }
`;
const Terms = styled.div`
  font-size: 14px;
  @media ${breakpoints.tablet} {
    margin-left: auto;
  }
`;
const Copyright = styled.div`
  font-size: 14px;
`;
const SocialContainer = styled.div`
  display: flex;
  gap: 12px;
`;
const Icon = (p: FontAwesomeIconProps) => {
  const isTablet = useTablet();
  return <FontAwesomeIcon {...p} size={isTablet ? "sm" : "lg"} />;
};

type Props = React.ComponentProps<typeof StyledContainer>;
export const Footer = (p: Props) => {
  const { t } = useTranslation("footer");
  const { route } = useRoute();
  const navtoUrl = (url: string, blank?: boolean) => () =>
    window.open(url, blank ? "_blank" : undefined);
  return (
    <StyledContainer {...p}>
      <GridItem area="logo">
        <Logo />
      </GridItem>
      {/*
      Pretty sure we'll re-add this again at some point:
      <GridItem area="landings">
        <Section>
          <SectionHeader>{t("section.landing.header")}</SectionHeader>
          <a href="https://foodimus.com">{t("section.landing.item-start")}</a>
        </Section>
      </GridItem>
      <GridItem area="about">
        <Section>
          <SectionHeader>{t("section.about.header")}</SectionHeader>
          <a>{t("section.about.item-about-us")}</a>
        </Section>
      </GridItem> */}
      <GridItem area="social">
        <Section>
          <SectionHeader>{t("section.social.header")}</SectionHeader>
          <SocialContainer>
            <IconButton
              aria-label="Instagram"
              onClick={navtoUrl("https://www.instagram.com/foodimus/", true)}
            >
              <Icon icon={faInstagram} />
            </IconButton>
            <IconButton
              aria-label="Facebook"
              onClick={navtoUrl("https://www.facebook.com/foodimus/", true)}
            >
              <Icon icon={faFacebookF} />
            </IconButton>
          </SocialContainer>
        </Section>
      </GridItem>
      <GridItem area="separator">
        <Separator color={separatorColor} />
      </GridItem>
      <GridItem area="terms">
        <Terms>
          <InertiaLink href={route("privacypol")}>
            {t("privacy-policy")}
          </InertiaLink>
          {" - "}
          <InertiaLink href={route("terms")}>
            {t("terms-and-conditions")}
          </InertiaLink>
        </Terms>
      </GridItem>
      <GridItem area="copyright">
        <Copyright>
          {t("copyright-notice", { year: DateTime.now().year })}
        </Copyright>
      </GridItem>
    </StyledContainer>
  );
};

export default Footer;
