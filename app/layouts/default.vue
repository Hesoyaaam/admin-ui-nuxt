<template>
  <div class="page">
    <Sidebar />
    <Header />

    <!-- Content -->
    <div class="page-wrapper">
      <!-- Page Content -->
      <div class="page-body">
        <div class="container-xl">
          <!-- Breadcrumb -->
          <div
            class="page-header d-print-none mb-3"
            v-if="pageTitle || $slots.header"
          >
            <div class="row align-items-center">
              <div class="col-auto">
                <AppBreadcrumb />
                <h2 class="page-title">
                  {{ pageTitle }}
                </h2>
              </div>
              <div class="col-auto ms-auto d-print-none" v-if="$slots.actions">
                <slot name="actions" />
              </div>
            </div>
          </div>

          <!-- Slot konten halaman -->
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

const { initTheme } = useTheme();
const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();
let timeoutId = null;

const pageTitle = computed(() => route.meta?.title || "");

const triggerAutoLogout = () => {
  authStore.logout();
  router.push("/login");
};

const resetTimer = () => {
  if (timeoutId) clearTimeout(timeoutId);

  const isRememberMe =
    process.client && localStorage.getItem("remember_me") === "true";

  if (isRememberMe) {
    return;
  }

  if (authStore.token || (process.client && localStorage.getItem("token"))) {
    timeoutId = setTimeout(
      () => {
        alert("Sesi Anda telah berakhir");
        triggerAutoLogout();
      },
      3 * 60 * 1000,
    );
  }
};

const browserEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];

onMounted(() => {
  initTheme();

  browserEvents.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });
  resetTimer();
});

onUnmounted(() => {
  browserEvents.forEach((event) => {
    window.removeEventListener(event, resetTimer);
  });
  if (timeoutId) clearTimeout(timeoutId);
});
</script>
