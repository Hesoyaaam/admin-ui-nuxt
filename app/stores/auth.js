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
      if (process.client) {
        alert("Sesi Anda telah habis (3 menit). Silakan login kembali.");
      }
      logout();
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}

    user.value = null;
    token.value = null;

    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("is_logged_in");
      localStorage.removeItem("remember_me");
      localStorage.removeItem("login_time");

      window.location.href = "/login";
    }
  };

  return { user, token, fetchUser, logout };
});
