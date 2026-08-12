import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);

  const fetchUser = async () => {
    try {
      const res = await $fetch("/api/me");

      if (res.status === "success") {
        user.value = res.user;
      }
    } catch (err) {
      logout();
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}

    user.value = null;
    token.value = null;
    navigateTo("/login");
  };

  return { user, token, fetchUser, logout };
});
