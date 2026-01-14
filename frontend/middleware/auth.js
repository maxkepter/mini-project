import { LocalStorageKeys } from "~/const/local-storage.const";

export default function ({ route, redirect }) {
  // Only run on client side
  if (!process.client) return;

  // Find route record with auth meta
  let authMeta = null;
  let requiredRoles = null;

  // Check route.meta directly (Nuxt 2 puts all meta in an array)
  if (Array.isArray(route.meta)) {
    authMeta = route.meta.find((m) => m && m.auth === true);
    const rolesMeta = route.meta.find((m) => m && m.roles);
    requiredRoles = rolesMeta?.roles;
  } else if (route.meta && route.meta.auth) {
    authMeta = route.meta;
    requiredRoles = route.meta.roles;
  }

  // If route doesn't require auth, allow access
  if (!authMeta || authMeta.auth !== true) return;

  // Check if user is authenticated
  const userInfoStr = localStorage.getItem(LocalStorageKeys.USER_INFO);
  if (!userInfoStr) {
    console.log("No user info found, redirecting to login");
    return redirect("/auth/login");
  }

  // If roles are required, check user role
  if (requiredRoles && requiredRoles.length > 0) {
    try {
      const user = JSON.parse(userInfoStr);
      const userRole = user.role;

      console.log(
        "Checking access - User role:",
        userRole,
        "Required roles:",
        requiredRoles
      );

      if (!requiredRoles.includes(userRole)) {
        console.log("Access denied - redirecting to 403");
        return redirect("/403");
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
      return redirect("/auth/login");
    }
  }
}
