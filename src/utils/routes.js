export const getRedirectPathByRole = (role) => {
  switch (role) {
    case "Manager Destination Warehouse":
      return "/packages";
    case "Staff Main Warehouse":
      return "/input";
    case "Manager Main Warehouse":
      return "/input";
    default:
      return "/";
  }
};