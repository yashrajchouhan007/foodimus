# My Foodimus front-end

The front-end of My Foodimus is built on InertiaJS. 
You can read more about InertiaJS in the [docs](https://inertiajs.com).
In short, the app is an SPA in which Inertia handles XHR-requests to fetch data. The first page that's loaded doesn't need to do an XHR-request, because the data is already embedded.

This means that rendering pages is much like rendering blade templates in "traditional" Laravel.

There's a single blade template that's rendered when a page is first loaded: `resources/views/app.blade.php`.
The entry point for the React app is in `resources/js/app.js`


## Directory structure

- `Types`
  - Some definitions for types that are used in multiple locations
- `Components/foodimus`
  - All of the Foodimus-specific reusable components
- `Components/foodimus/header-parts`
  - Components that are header-specific
- `Components/foodimus/typography`
  - Components for basic text styling
- `Layouts`
  - Page structures for specific types of pages
- `Theme`
  - All the colors, fonts and breakpoints used throughout the app
- `Hooks`
  - Custom React hooks
- `Pages`
  - The entrypoints for the different pages that are loaded through `Inertia::render` calls from the back-end
- `Pages/MyFoodimus/auth`
  - Pages related to logging in and resetting your password
- `Pages/MyFoodimus/onboarding`
  - Pages related to the onboarding funnel
- `Pages/MyFoodimus/user`
  - The user settings pages
- `Pages/MyFoodimus/meal`
  - The pages that look at specific meals
- `Helpers`
  - General re-usable helpers
- `Translations`
  - The translations used in the front-end
- `Partials`
  - Parts of pages. Usually not very re-usable but broken up from the page so they're easier to manage


## General set-up of a page

```tsx
import React from "react";
import styled from "styled-components";
/* All the other imports */

// Any components that need to be styled 
const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
`

// The props passed to the page from the back-end
// All fields are optional so we're forced to write the page component
// in a defensive manner
type Props = {
    // This is passed automatically when a user is logged in
    auth?: Auth;

    // This is passed when a flash message should be shown
    flash?: FlashProps | null;

    // Page-specific data
    some_key?: string;
    some_other_key?: string;
};

// The definition of the page component
export const ExamplePage = ({ some_key, some_other_key, ...p }: Props) => {
  // Get the `example-page` translation namespace
  const { t } = useTranslation("example-page");

  // `route` is used to transform named routes into urls
  const { route } = useRoute();

  // Return the rendered page
  return (
    <Layout {...p}>
        <H3>{t("title")}</H3>
        <StyledContainer>
            <BodyText>{some_key}</BodyText>
            {!!some_other_key&& (
                <BodyText variant="bold">{some_other_key}</BodyText>
            )}
        </StyledContainer>
    </Layout>
  );
};

export default ExamplePage;
```