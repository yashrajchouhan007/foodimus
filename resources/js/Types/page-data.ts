export type AvatarOrientation = "left" | "right" | "front";
export type Avatar = {
  src: string;
  orientation?: AvatarOrientation;
};
export type Image = {
  src: string;
  focus?: [number, number];
};
export type Ambassador = {
  avatar?: Avatar;
  slug: string;
  name: string;
  shortName: string;
  overlayImg?: Image;
  heroImg?: Image;
  headerImg?: Image;
};
export type MealPlan = {
  slug: string;
  heroImg?: Image;
  ambassador?: Ambassador;
  title: string;
  totalDays: number;
  caption: string;
};
export type Auth = {
  user: {
    avatar: Avatar | string;
    firstname: string;
    lastname: string | null;
    email: string;
    cms_url?: string;
  };
};

export type TipProps = {
  ambassador?: Ambassador;
  ambassadorTitle: string;
  text: string;
  button?: string;
  buttonTarget?: string;
  buttonTargetParam?: { [p: string]: string };
};

export type Price = {
  currency: string;
  amount: number;
};
export type Prices = {
  yearly: Price;
  monthly: Price;
};
export type PaymentType = keyof Prices;
