<template>
  <form @submit.prevent="handleLogin" novalidate>
    <div v-if="errorMsg" class="alert alert-danger mb-3" role="alert">
      {{ errorMsg }}
    </div>

    <!-- Username -->
    <div class="mb-2">
      <input
        v-model="form.identifier"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Username / Email / No. HP"
        name="username"
        required
      />
    </div>

    <!-- Password -->
    <div class="mb-2">
      <input
        v-model="form.password"
        type="password"
        class="form-control py-3 border-0 bg-light text-dark"
        name="password"
        placeholder="Password"
        required
      />
    </div>

    <!-- Captcha Section -->
    <div class="mb-2">
      <div class="d-flex align-items-center gap-2 mb-2">
        <div
          class="border rounded bg-light overflow-hidden flex-grow-1"
          style="height: 48px"
        >
          <img
            :src="captchaImage"
            alt="Captcha Code"
            v-if="captchaImage"
            style="
              height: 100%;
              width: 100%;
              object-fit: contain;
              display: block;
            "
          />
        </div>
        <button
          type="button"
          class="btn btn-outline-secondary py-2 px-3"
          @click="fetchCaptcha"
          title="Muat ulang captcha"
        >
          🔄
        </button>
      </div>
      <input
        v-model="form.captcha_input"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Masukkan Kode Captcha"
        required
      />
    </div>

    <div class="mb-2">
      <label class="form-check">
        <input
          v-model="form.remember_me"
          type="checkbox"
          class="form-check-input"
        />
        <span class="form-check-label">Remember Me</span>
      </label>
    </div>

    <div class="mb-2">
      <div
        class="g-recaptcha"
        :data-sitekey="siteKey"
        data-callback="recaptchaCallback"
      ></div>
    </div>

    <!-- Submit -->
    <div class="d-grid mt-4">
      <button
        class="btn btn-primary text-uppercase shadow py-3"
        type="submit"
        :disabled="loading"
      >
        Masuk
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { loginSchema } from "~/utils/schemas";

const loading = ref(false);
const errorMsg = ref("");
const captchaImage = ref("");

const form = reactive({
  identifier: "",
  password: "",
  remember_me: false,
  captcha_input: "",
  captcha_id: "",
});

const fetchCaptcha = async () => {
  try {
    errorMsg.value = "";
    const res = await $fetch("/api/auth/captcha");
    if (res.status === "success") {
      captchaImage.value = res.data.image;
      form.captcha_id = res.data.captcha_id;
      form.captcha_input = "";
    }
  } catch (err) {
    errorMsg.value = "Gagal memuat kode captcha";
  }
};

onMounted(() => {
  fetchCaptcha();
});

const handleLogin = async () => {
  errorMsg.value = "";

  const parsedData = loginSchema.safeParse({
    identifier: form.identifier,
    password: form.password,
  });

  if (!parsedData.success) {
    errorMsg.value = parsedData.error.issues[0].message;
    return;
  }

  if (!form.captcha_input) {
    errorMsg.value = "Silakan masukkan kode Captcha.";
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        identifier: form.identifier,
        password: form.password,
        captcha_input: form.captcha_input,
        captcha_id: form.captcha_id,
        remember_me: form.remember_me,
      },
    });

    if (response.status === "success") {
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      localStorage.setItem("is_logged_in", "true");
      localStorage.setItem("remember_me", form.remember_me.toString());
      localStorage.setItem("login_time", Date.now().toString());

      window.location.href = "/";
    }
  } catch (error) {
    errorMsg.value =
      error.data?.message ||
      error.data?.statusMessage ||
      "Terjadi kesalahan pada server.";
    fetchCaptcha();
  } finally {
    loading.value = false;
  }
};
</script>
