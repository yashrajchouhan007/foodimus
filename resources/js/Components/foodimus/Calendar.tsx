/**
 * The calendar that's used on the "Today" and "Shopping list" pages
 */

import React from "react";
import styled from "styled-components";
import ReactCalendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { definition as faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { definition as faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { useTranslation } from "react-i18next";

const StyledContainer = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.colors.blue};
  padding: 8px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  width: 338px;
  & .react-calendar {
    text-align: center;
    display: inline-flex;
    flex-direction: column;
    &__viewContainer {
      margin-left: -4px;
      margin-right: -4px;
    }
    &__navigation {
      margin: 10px 0 16px;
      padding: 7px 7px 0;
      display: flex;
      width: 100%;
      &__arrow {
        font-size: 20px;
      }
    }
    &__month-view {
      font-family: ${(props) => props.theme.fonts.controlBold};
      &__weekdays {
        position: relative;
        &:after {
          content: "";
          position: absolute;
          right: 4px;
          left: 4px;
          bottom: 1px;
          height: 1px;
          background-color: ${(props) => props.theme.colors.blueL20};
        }
      }
      &__days {
        font-size: 17px;
      }
    }

    &__tile {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      abbr {
        display: block;
        padding-top: 4px;
        line-height: 34px;
        width: 38px;
        max-width: 38px !important;
        border-radius: 9999px;
      }
    }
    &__tile abbr {
      background-color: ${(props) => props.theme.colors.blueL20};
      color: ${(props) => props.theme.colors.white};
    }
    &__tile[disabled] abbr {
      background-color: initial;
    }
    &__tile--now abbr {
      box-shadow: inset 0 0 0 2px ${(props) => props.theme.colors.blueL40};
    }
    &__tile--active abbr {
      background-color: ${(props) => props.theme.colors.white};
      color: ${(props) => props.theme.colors.dark};
      box-shadow: none;
    }
  }
`;
const Header = styled.div`
  font-size: 19px;
  font-family: ${(props) => props.theme.fonts.controlBold};
  padding: 7px 7px 0;
`;
const CloseButton = styled.button`
  display: flex;
  position: absolute;
  right: 11px;
  top: 8px;
  width: 12px;
  height: 12px;
  @media (hover: hover) {
    &:hover {
      opacity: 0.8;
    }
  }
  &:active {
    opacity: 0.6;
  }
  transition: opacity 100ms linear;
`;
type Props = React.ComponentProps<typeof ReactCalendar> & {
  title?: string;
  closeable?: boolean;
  onClose?: () => void;
};

export const Calendar = ({ title, closeable, onClose, ...p }: Props) => {
  const { i18n } = useTranslation();

  return (
    <StyledContainer>
      <Header>{title}</Header>
      {closeable !== false && (
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      )}
      <ReactCalendar
        nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
        prevLabel={<FontAwesomeIcon icon={faChevronLeft} />}
        next2Label={null}
        prev2Label={null}
        locale={i18n.language}
        minDetail="month"
        {...p}
      />
    </StyledContainer>
  );
};
export default Calendar;
