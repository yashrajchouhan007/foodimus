/**
 * A text container that renders Markdown text
 */

import React from "react";
import ReactMarkdown from "react-markdown";
import styled, { css } from "styled-components";
import BodyText from "./typography/BodyText";
import { H2, H3, H4 } from "./typography/Headings";
import remarkDirective from "remark-directive";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isThemeColor, ThemeColor } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import { ErrorBoundary } from "@sentry/react";
import Separator from "./Separator";
const StyledMarkdown = styled(ReactMarkdown)<{
  unstyled?: string[];
}>`
  p,
  h1,
  h2,
  h3,
  h4,
  h5 {
    :not(:first-child) {
      margin-top: 0.5em;
    }
  }
  ${({ unstyled }) =>
    !unstyled?.includes("ul") &&
    css`
      ul {
        margin-left: 1.5em;
        li:before {
          content: "\u26AC";
          display: inline-block;
          min-width: 1.5em;
          margin-left: -1.5em;
          color: ${({ theme }) => theme.colors.red};
        }
      }
    `}
  ${({ unstyled }) =>
    !unstyled?.includes("ol") &&
    css`
      ol {
        margin-left: 1.5em;
        counter-reset: markdown;
        li {
          counter-increment: markdown;
        }
        li:before {
          content: counter(markdown) ".";
          display: inline-block;
          min-width: 1.5em;
          margin-left: -1.5em;
          color: ${({ theme }) => theme.colors.red};
        }
      }
    `}
  a,
  button {
    color: ${({ theme }) => theme.colors.red};
    transition: color 150ms linear;
    @media (hover: hover) {
      :hover {
        color: ${({ theme }) => theme.colors.redL30};
      }
    }
    :active {
      color: ${({ theme }) => theme.colors.redL10};
    }
  }
`;

const StyledText = styled.span.withConfig(hidePropsFromHtml("color"))<{
  color?: ThemeColor;
}>`
  ${({ color, theme }) => color && `color: ${theme.colors[color]};`}
`;

/**
 * This plugin allows you to use `:purple[some_text]` to render some_text in purple, for example
 */
const colorsPlugin: Plugin = function (_options: any) {
  return (tree, _file) => {
    visit(tree, (node: any) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const { name } = node;
        if (!isThemeColor(name)) return;

        const data = node.data || (node.data = {});

        data.hName = "span";
        data.hProperties = {
          color: name,
        };
      }
    });
  };
};

/**
 * This plugin allows you to use `:br[]` to add a line break in the middle of a title
 */
const breakPlugin: Plugin = function (_options: any) {
  return (tree, _file) => {
    visit(tree, (node: any) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const { name } = node;
        if (name !== "br") return;

        const data = node.data || (node.data = {});

        data.hName = "br";
        data.hProperties = {};
      }
    });
  };
};
/**
 * This plugin allows you to use `:br[]` to add a line break in the middle of a title
 */
const iconPlugin: Plugin = function (_options: any) {
  return (tree, _file) => {
    visit(tree, (node: any) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const { name } = node;
        if (name !== "icon") return;

        const data = node.data || (node.data = {});

        data.hName = "icon";
        data.hProperties = {};
      }
    });
  };
};

type Props = React.ComponentProps<typeof ReactMarkdown> & {
  linkAsAnchor?: boolean;
};
type ParsedUrl = {
  target: "_blank" | "_top" | "inertia";
  href: string;
};

export const Markdown = ({ linkAsAnchor, components, ...p }: Props) => {
  const { route } = useRoute();
  const parseUrl = (href: string | undefined): null | ParsedUrl => {
    if (href === undefined) return null;
    const url = new URL(href, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return {
        target: "_blank",
        href: url.href,
      };
    } else if (url.protocol === "route:") {
      const _params = {} as { [k: string]: string };
      url.searchParams.forEach((v, k) => {
        _params[k] = v;
      });
      const { _blank, ...params } = _params;

      const newHref = `${route(url.pathname.replace(/^\/\//, ""), params)}`;
      if (!!_blank && _blank !== "0" && _blank !== "false") {
        return {
          target: "_blank",
          href: newHref,
        };
      } else {
        return {
          target: "inertia",
          href: newHref,
        };
      }
    }
    return null;
  };
  const handleLink = (url: ParsedUrl | null) => {
    if (!url) return;
    if (url.target === "inertia") return Inertia.get(url.href);
    return window.open(url.href, url.target);
  };
  return (
    <ErrorBoundary>
      <StyledMarkdown
        remarkPlugins={[
          [remarkDirective, {}],
          [colorsPlugin, {}],
          [breakPlugin, {}],
          [iconPlugin, {}],
        ]}
        components={{
          h1: ({ children }) => <H2>{children}</H2>,
          h2: ({ children }) => <H3>{children}</H3>,
          h3: ({ children }) => <H4>{children}</H4>,
          h4: ({ children }) => <BodyText variant="bold">{children}</BodyText>,
          h5: ({ children }) => (
            <BodyText variant="medium">{children}</BodyText>
          ),
          a: ({ children, href }) => {
            let url = null as null | ParsedUrl;
            try {
              url = parseUrl(href);
            } catch (e) {}

            return linkAsAnchor ? (
              <a
                href={url?.href || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(url);
                }}
              >
                {children}
              </a>
            ) : (
              <button
                onClick={() => {
                  handleLink(url);
                }}
              >
                {children}
              </button>
            );
          },
          span: ({ children, ...p }) => (
            <StyledText {...(p as any)}>{children}</StyledText>
          ),
          hr: () => <Separator />,
          ...components,
        }}
        transformLinkUri={false}
        {...p}
      />
    </ErrorBoundary>
  );
};

export default Markdown;
