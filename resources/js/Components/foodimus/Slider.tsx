/**
 * A horizontal slider component, used to give a numerical input
 */
import Slider from "rc-slider";
import styled from "styled-components";

// cloned default styling from rc-slider and made some changes

export default styled(Slider)`
  position: relative;
  height: 14px;
  padding: 30px 0 11px;
  width: 286px;
  border-radius: 6px;
  touch-action: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: ${(props) => props.theme.fonts.control};
  & * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  & .rc-slider-rail {
    position: absolute;
    width: 100%;
    background-color: ${(props) => props.theme.colors.purple};
    height: 1px;
    border-radius: 6px;
  }
  & .rc-slider-track {
    position: absolute;
    left: 0;
    height: 1px;
    border-radius: 6px;
    background-color: ${(props) => props.theme.colors.purple};
  }
  & .rc-slider-handle {
    position: absolute;
    width: 22px;
    height: 22px;
    cursor: pointer;
    cursor: -webkit-grab;
    margin-top: -11px;
    cursor: grab;
    border-radius: 50%;
    border: solid 3px ${(props) => props.theme.colors.white};
    background-color: #fff;
    touch-action: pan-x;
    &:before {
      content: "";
      border: solid 4px ${(props) => props.theme.colors.purple};
      transition: border 100ms linear;
      position: absolute;
      border-radius: 50%;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
  }
  &
    .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
  }
  & .rc-slider-handle:focus {
    outline: none;
  }
  & .rc-slider-handle-click-focused:focus {
    box-shadow: unset;
    &:before {
      border-color: ${(props) => props.theme.colors.purpleL20};
    }
  }
  @media (hover: hover) {
    & .rc-slider-handle:hover {
      &:before {
        border-color: ${(props) => props.theme.colors.purpleL20};
      }
    }
  }
  & .rc-slider-handle:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
    &:before {
      border-color: ${(props) => props.theme.colors.purpleL10};
    }
  }
  & .rc-slider-mark {
    position: absolute;
    top: -3px;
    left: 0;
    width: 100%;
    font-size: 12px;
  }
  & .rc-slider-mark-text {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
  }
  & .rc-slider-mark-text-active {
  }
  & .rc-slider-step {
    position: absolute;
    width: 100%;
    height: 4px;
    background: transparent;
  }
  & .rc-slider-dot {
  }
  & .rc-slider-dot-active {
  }
  & .rc-slider-dot-reverse {
  }
  & .rc-slider-disabled {
    background-color: #e9e9e9;
  }
  & .rc-slider-disabled .rc-slider-track {
    background-color: #ccc;
  }
  & .rc-slider-disabled .rc-slider-handle,
  & .rc-slider-disabled .rc-slider-dot {
    border-color: #ccc;
    box-shadow: none;
    background-color: #fff;
    cursor: not-allowed;
  }
  & .rc-slider-disabled .rc-slider-mark-text,
  & .rc-slider-disabled .rc-slider-dot {
    cursor: not-allowed !important;
  }
  & .rc-slider-vertical {
    width: 14px;
    height: 100%;
    padding: 0 5px;
  }
  & .rc-slider-vertical .rc-slider-rail {
    height: 100%;
    width: 4px;
  }
  & .rc-slider-vertical .rc-slider-track {
    left: 5px;
    bottom: 0;
    width: 4px;
  }
  & .rc-slider-vertical .rc-slider-handle {
    margin-left: -5px;
    touch-action: pan-y;
  }
  & .rc-slider-vertical .rc-slider-mark {
    top: 0;
    left: 18px;
    height: 100%;
  }
  & .rc-slider-vertical .rc-slider-step {
    height: 100%;
    width: 4px;
  }
  & .rc-slider-vertical .rc-slider-dot {
    left: 2px;
    margin-bottom: -4px;
  }
  & .rc-slider-vertical .rc-slider-dot:first-child {
    margin-bottom: -4px;
  }
  & .rc-slider-vertical .rc-slider-dot:last-child {
    margin-bottom: -4px;
  }
  & .rc-slider-tooltip-zoom-down-enter,
  & .rc-slider-tooltip-zoom-down-appear {
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: block !important;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  & .rc-slider-tooltip-zoom-down-leave {
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: block !important;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  & .rc-slider-tooltip-zoom-down-enter.rc-slider-tooltip-zoom-down-enter-active,
  &
    .rc-slider-tooltip-zoom-down-appear.rc-slider-tooltip-zoom-down-appear-active {
    -webkit-animation-name: rcSliderTooltipZoomDownIn;
    animation-name: rcSliderTooltipZoomDownIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  &
    .rc-slider-tooltip-zoom-down-leave.rc-slider-tooltip-zoom-down-leave-active {
    -webkit-animation-name: rcSliderTooltipZoomDownOut;
    animation-name: rcSliderTooltipZoomDownOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  & .rc-slider-tooltip-zoom-down-enter,
  & .rc-slider-tooltip-zoom-down-appear {
    transform: scale(0, 0);
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  & .rc-slider-tooltip-zoom-down-leave {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  @-webkit-keyframes rcSliderTooltipZoomDownIn {
    0% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
    100% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
  }
  @keyframes rcSliderTooltipZoomDownIn {
    0% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
    100% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
  }
  @-webkit-keyframes rcSliderTooltipZoomDownOut {
    0% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
    100% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
  }
  @keyframes rcSliderTooltipZoomDownOut {
    0% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
    100% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
  }
  & .rc-slider-tooltip {
    position: absolute;
    left: -9999px;
    top: -9999px;
    visibility: visible;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  & .rc-slider-tooltip * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  & .rc-slider-tooltip-hidden {
    display: none;
  }
  & .rc-slider-tooltip-placement-top {
    padding: 4px 0 8px 0;
  }
  & .rc-slider-tooltip-inner {
    padding: 6px 2px;
    min-width: 24px;
    height: 24px;
    font-size: 12px;
    line-height: 1;
    color: #fff;
    text-align: center;
    text-decoration: none;
    background-color: #6c6c6c;
    border-radius: 6px;
    box-shadow: 0 0 4px #d9d9d9;
  }
  & .rc-slider-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }
  & .rc-slider-tooltip-placement-top .rc-slider-tooltip-arrow {
    bottom: 4px;
    left: 50%;
    margin-left: -4px;
    border-width: 4px 4px 0;
    border-top-color: #6c6c6c;
  }
`;
