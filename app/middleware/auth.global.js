export default defineNuxtRouteMiddleware((to, from) => {
  const publicPages = ["/login"];
  const authCookie = useCookie("auth_token");

  let hasClientToken = false;
  if (process.client) {
    hasClientToken = !!localStorage.getItem("token");
  }

  const isAuthenticated = authCookie.value || hasClientToken;

  if (!publicPages.includes(to.path) && !isAuthenticated) {
    return navigateTo("/login");
  }

  if (to.path === "/login" && isAuthenticated) {
    return navigateTo("/");
  }
});
