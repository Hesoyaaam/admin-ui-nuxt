<template>
  <div>
    <h3 class="card-title">
      Bulan {{ namaBulan[bulanTerpilih - 1] }} {{ tahunTerpilih }}
    </h3>
    <div class="card">
      <div class="card-header">
        <button
          class="btn btn-primary"
          @click="hitungTunjangan"
          :disabled="isCalculating"
        >
          <span
            v-if="isCalculating"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Hitung Tunjangan
        </button>
        <div class="ms-auto">
          <div class="input-group">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Cari Penerima ..."
            />
            <button class="btn" type="button">
              <IconSearch stroke="{2}" />
            </button>
          </div>
        </div>
      </div>
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5" class="text-center">No</th>
              <th class="cursor-pointer" @click="sortBy('nama_pegawai')">
                Nama Penerima <span v-html="sortIcon('nama_pegawai')"></span>
              </th>
              <th
                class="text-center cursor-pointer"
                @click="sortBy('total_km')"
              >
                Kilometer <span v-html="sortIcon('total_km')"></span>
              </th>
              <th
                class="text-center cursor-pointer"
                @click="sortBy('jumlah_hari')"
              >
                Jumlah Hari <span v-html="sortIcon('jumlah_hari')"></span>
              </th>
              <th
                class="text-end cursor-pointer"
                @click="sortBy('nominal_tunjangan')"
              >
                Nominal <span v-html="sortIcon('nominal_tunjangan')"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending">
              <td colspan="5" class="text-center py-4">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredAndSortedData.length === 0">
              <td colspan="5" class="text-center py-4 text-secondary">
                Tidak ada data. Silakan klik "Hitung Tunjangan" terlebih dahulu.
              </td>
            </tr>
            <tr
              v-else
              v-for="(item, index) in filteredAndSortedData"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.nama_pegawai }}</td>
              <td class="text-center">{{ item.total_km }}</td>
              <td class="text-center">{{ item.jumlah_hari || 0 }}</td>
              <td class="text-end text-success fw-bold">
                {{ formatRupiah(item.nominal_tunjangan) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="!pending && filteredAndSortedData.length > 0"
        class="card-footer d-flex align-items-center"
      >
        <p class="m-0 text-secondary">
          Menampilkan <span>1</span> hingga
          <span>{{ filteredAndSortedData.length }}</span> dari
          <span>{{ filteredAndSortedData.length }}</span> entri
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { IconSearch } from "@tabler/icons-vue";
import { formatRupiah } from "~/utils/formatRupiah.js";

definePageMeta({ title: "Detail Tunjangan Transport" });
useSeoMeta({ title: "Detail Tunjangan Transport" });

const route = useRoute();
const bulanTerpilih = Number(route.params.id);
const tahunTerpilih = Number(route.query.tahun) || new Date().getFullYear();

const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const isCalculating = ref(false);
const searchQuery = ref("");
const sortKey = ref("");
const sortAsc = ref(true);

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

const {
  data: response,
  pending,
  refresh,
} = await useAsyncData(
  "detail-transport",
  () =>
    $fetch(
      `/api/transport/detail?bulan=${bulanTerpilih}&tahun=${tahunTerpilih}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    ),
  { server: false },
);

const hitungTunjangan = async () => {
  const konfirmasi = confirm(
    "Hitung ulang tunjangan bulan ini? Data lama akan tertimpa.",
  );
  if (!konfirmasi) return;

  isCalculating.value = true;
  try {
    const res = await $fetch("/api/transport/hitung", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { bulan: bulanTerpilih, tahun: tahunTerpilih },
    });

    if (res.status === "success") {
      alert("Perhitungan berhasil!");
      refresh();
    }
  } catch (error) {
    alert("Gagal menghitung tunjangan.");
  } finally {
    isCalculating.value = false;
  }
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const sortIcon = (key) => {
  if (sortKey.value !== key)
    return '<span class="text-muted opacity-25">↕</span>';
  return sortAsc.value ? "<span>↑</span>" : "<span>↓</span>";
};

const filteredAndSortedData = computed(() => {
  let data = response.value?.data || [];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter((item) => item.nama_pegawai.toLowerCase().includes(q));
  }

  if (sortKey.value) {
    data = [...data].sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];

      if (sortKey.value === "nama_pegawai") {
        return sortAsc.value
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortAsc.value ? valA - valB : valB - valA;
    });
  }

  return data;
});
</script>
