<template>
  <div class="card">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="" class="form-label">Tarif (Rp)</label>
          <input
            type="text"
            class="form-control text-end"
            :class="{ 'is-invalid': errors.tarif_per_km }"
            :value="formattedTarif"
            @input="updateTarif"
            placeholder="0"
          />
          <div class="invalid-feedback" v-if="errors.tarif_per_km">
            {{ errors.tarif_per_km }}
          </div>
        </div>

        <div class="col-md-6">
          <label for="" class="form-label">Berlaku Mulai</label>
          <input
            type="date"
            v-model="form.berlaku_mulai"
            class="form-control"
            :class="{ 'is-invalid': errors.berlaku_mulai }"
          />
          <div class="invalid-feedback" v-if="errors.berlaku_mulai">
            {{ errors.berlaku_mulai }}
          </div>
        </div>

        <div class="col-md-6">
          <label for="" class="form-label">Minimum Kilometer</label>
          <input
            type="number"
            min="0"
            v-model.number="form.min_km"
            class="form-control"
            :class="{ 'is-invalid': errors.min_km }"
            placeholder="0"
          />
          <div class="invalid-feedback" v-if="errors.min_km">
            {{ errors.min_km }}
          </div>
        </div>

        <div class="col-md-6">
          <label for="" class="form-label">Maksimum Kilometer</label>
          <div class="input-group">
            <input
              type="number"
              min="0"
              v-model.number="form.max_km"
              class="form-control"
              :class="{ 'is-invalid': errors.max_km }"
              placeholder="0"
            />
            <span class="input-group-text">km</span>
            <div class="invalid-feedback d-block" v-if="errors.max_km">
              {{ errors.max_km }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="d-flex gap-2">
        <button
          class="btn btn-primary"
          @click="simpanSetting"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          Simpan
        </button>
        <button
          class="btn btn-outline-primary"
          @click="goBack"
          :disabled="isSubmitting"
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { transportSettingSchema } from "~/utils/schemas";

const router = useRouter();
const goBack = () => {
  router.back();
};

const isSubmitting = ref(false);

const errors = ref({});

const form = ref({
  tarif_per_km: null,
  berlaku_mulai: "",
  min_km: 0,
  max_km: 0,
});

const formattedTarif = computed(() => {
  if (!form.value.tarif_per_km) return "";
  return form.value.tarif_per_km.toLocaleString("id-ID");
});

const updateTarif = (event) => {
  const rawValue = event.target.value.replace(/\D/g, "");
  form.value.tarif_per_km = rawValue ? parseInt(rawValue, 10) : null;
};

const simpanSetting = async () => {
  errors.value = {};

  const parsedData = transportSettingSchema.safeParse(form.value);

  if (!parsedData.success) {
    parsedData.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (!errors.value[field]) {
        errors.value[field] = issue.message;
      }
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const token = localStorage.getItem("token") || "";

    const res = await $fetch("/api/transport", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: parsedData.data,
    });

    if (res.status === "success") {
      alert("Pengaturan Tunjangan Transport berhasil disimpan!");
      form.value = {
        tarif_per_km: null,
        berlaku_mulai: "",
        min_km: 0,
        max_km: 0,
      };
    }
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    const errorMsg =
      error.data?.message || "Terjadi kesalahan saat menyimpan data.";
    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
