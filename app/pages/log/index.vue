<template>
  <div class="card">
    <div class="card-header">
      <div class="ms-auto">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Cari Data ..."
          />
          <button class="btn" type="button">
            <IconSearch stroke="2" />
          </button>
        </div>
      </div>
    </div>
    <div class="table-responsive card-body p-0">
      <table class="table table-vcenter">
        <thead>
          <tr>
            <th width="5">No</th>
            <th>Nama User</th>
            <th>Modul</th>
            <th>Aksi</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="5" class="text-center py-4">Memuat data...</td>
          </tr>
          <tr v-else-if="dataLogs.length === 0">
            <td colspan="5" class="text-center py-4 text-secondary">
              Tidak ada data log.
            </td>
          </tr>

          <tr v-else v-for="(item, index) in dataLogs" :key="item.id">
            <td class="text-center">{{ (page - 1) * limit + index + 1 }}</td>
            <td>{{ item.nama_user }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.content }}</td>
            <td>{{ formatWaktu(item.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex align-items-center justify-content-between">
      <p class="m-0 text-secondary">
        Menampilkan halaman <span>{{ metaData.page }}</span> dari
        <span>{{ metaData.totalPages }}</span>
      </p>
      <ul class="pagination m-0">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">
            <IconChevronLeft stroke="2" size="16" /> Prev
          </a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: page >= metaData.totalPages }"
        >
          <a class="page-link" href="#" @click.prevent="nextPage">
            Next <IconChevronRight stroke="2" size="16" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-vue";

definePageMeta({
  title: "Log Aktifitas",
});

useSeoMeta({
  title: "Log Aktifitas",
});

const search = ref("");
const page = ref(1);
const limit = ref(15);

watch(search, () => {
  page.value = 1;
});

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

const { data: response, pending } = await useAsyncData(
  "logs-list",
  () =>
    $fetch("/api/logs", {
      headers: { Authorization: `Bearer ${token}` },
      query: {
        search: search.value,
        page: page.value,
        limit: limit.value,
      },
    }),
  {
    server: false,
    watch: [search, page],
  },
);

const dataLogs = computed(() => response.value?.data || []);
const metaData = computed(
  () => response.value?.meta || { page: 1, totalPages: 1 },
);

const formatWaktu = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};
const nextPage = () => {
  if (page.value < metaData.value.totalPages) page.value++;
};
</script>
