export const getRedirectPathByRole = (role) => {
  switch (role) {
    case "manager_destination_shipping":
      return "/packages";
    case "main_warehouse_staff":
      return "/input";
    default:
      return "/";
  }
};