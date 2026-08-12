<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex gap-2 ms-auto">
        <!-- Filter Tahun -->
        <select v-model="filterTahun" class="form-select" style="width: 180px">
          <option v-for="thn in daftarTahun" :key="thn" :value="thn">
            {{ thn }}
          </option>
        </select>

        <!-- Search -->
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Cari Bulan ..."
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
            <th width="5">No</th>
            <th>Nama Bulan</th>
            <th class="text-center">Total Penerima</th>
            <th class="text-center">Total Tunjangan Transport</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tr v-if="pending">
          <td colspan="5" class="text-center py-4">Memuat data...</td>
        </tr>
        <tr v-else-if="tunjanganTransport.length === 0">
          <td colspan="5" class="text-center py-4 text-secondary">
            Tidak ada data yang ditemukan.
          </td>
        </tr>
        <tbody
          v-else
          v-for="(item, index) in tunjanganTransport"
          :key="item.bulan"
        >
          <tr>
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ namaBulan[item.bulan - 1] }}</td>
            <td class="text-center">{{ item.total_penerima }}</td>
            <td class="text-center">
              {{ formatRupiah(item.total_tunjangan) }}
            </td>
            <td class="text-center">
              <NuxtLink
                :to="`/tunjangan/transport/detail/${item.bulan}?tahun=${filterTahun}`"
                class="btn btn-primary btn-sm"
                >Detail</NuxtLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="!pending && tunjanganTransport.length > 0"
      class="card-footer d-flex align-items-center"
    >
      <p class="m-0 text-secondary">
        Menampilkan <span>1</span> hingga
        <span>{{ tunjanganTransport.length }}</span> dari
        <span>{{ tunjanganTransport.length }}</span> entri
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { IconSearch } from "@tabler/icons-vue";
import { formatRupiah } from "~/utils/formatRupiah.js";

definePageMeta({ title: "Tunjangan Transport" });
useSeoMeta({ title: "Tunjangan Transport" });

const tahunSekarang = new Date().getFullYear();
const filterTahun = ref(tahunSekarang);
const daftarTahun = computed(() => {
  const tahun = [];
  for (let i = tahunSekarang; i >= tahunSekarang - 5; i--) {
    tahun.push(i);
  }
  return tahun;
});

const searchQuery = ref("");
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

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : "";
const { data: response, pending } = await useAsyncData(
  "rekap-transport",
  () =>
    $fetch("/api/transport/rekap", {
      query: { tahun: filterTahun.value },
      headers: { Authorization: `Bearer ${token}` },
    }),
  {
    server: false,
    watch: [filterTahun],
  },
);

const tunjanganTransport = computed(() => {
  let data = response.value?.data || [];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter((item) => {
      const nama = namaBulan[item.bulan - 1].toLowerCase();
      return nama.includes(q);
    });
  }

  return data;
});
</script>
