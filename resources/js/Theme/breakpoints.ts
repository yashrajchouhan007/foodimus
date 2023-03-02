export const size = {
  mobile: 500,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};
export default {
  mobile: `(min-width: ${size.mobile}px)`,
  tablet: `(min-width: ${size.tablet}px)`,
  laptop: `(min-width: ${size.laptop}px)`,
  desktop: `(min-width: ${size.desktop}px)`,
};
