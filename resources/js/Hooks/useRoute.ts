import Route, { Router } from "ziggy-js";

const getParams = (routeObj: Router) => {
  try {
    return routeObj.params;
  } catch (_) {
    return {};
  }
};

/**
 * Wrapper around ziggy-js's route method, so it plays nice with
 * TypeScript
 */
export const useRoute = () => {
  const route = (<any>window).route as typeof Route;
  const routeObj = route();
  const params = getParams(routeObj);
  const current = routeObj.current.bind(routeObj);
  return {
    route,
    current,
    params,
  };
};

export default useRoute;
