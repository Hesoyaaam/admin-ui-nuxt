export default defineNuxtRouteMiddleware((to, from) => {
  const publicPages = ["/login"];
  const authCookie = useCookie("auth_token");

  if (!publicPages.includes(to.path) && !authCookie.value) {
    return navigateTo("/login");
  }

  if (to.path === "/login" && authCookie.value) {
    return navigateTo("/");
  }
});
