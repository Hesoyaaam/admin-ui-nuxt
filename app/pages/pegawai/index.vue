<template>
  <NuxtLayout name="default">
    <template #actions>
      <NuxtLink v-if="!isManagerHRD" to="/pegawai/form" class="btn btn-primary">
        <IconPlus stroke="3" size="20" />Tambah
      </NuxtLink>
    </template>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Masa Kerja -->
          <div class="d-flex align-items-center gap-1">
            <span class="text-nowrap">Masa Kerja</span>
            <input
              type="number"
              v-model="masaKerjaMin"
              class="form-control"
              style="width: 70px"
              placeholder="Min"
            />
            -
            <input
              type="number"
              v-model="masaKerjaMax"
              class="form-control"
              style="width: 70px"
              placeholder="Max"
            />
          </div>

          <!-- Filter Jabatan -->
          <select v-model="jabatan" class="form-select" style="width: 180px">
            <option value="">Semua Jabatan</option>
            <option value="Programmer">Programmer</option>
            <option value="System Analyst">System Analyst</option>
            <option value="Akuntan">Akuntan</option>
            <option value="Manager Produksi">Manager Produksi</option>
          </select>

          <!-- Filter Kontrak -->
          <select
            v-model="statusKontrak"
            class="form-select"
            style="width: 180px"
          >
            <option value="">Status Kontrak</option>
            <option value="PKWTT">PKWTT</option>
            <option value="PKWT">PKWT</option>
            <option value="Magang">Magang</option>
          </select>

          <!-- Search -->
          <div class="input-group" style="width: 200px">
            <input
              type="text"
              v-model="search"
              class="form-control"
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
              <!-- Sembunyikan Header Aksi jika role adalah Manager HRD -->
              <th width="15" class="text-center" v-if="!isManagerHRD">Aksi</th>
              <th>NIP</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Tanggal Masuk</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending">
              <td colspan="6" class="text-center py-4">Memuat data...</td>
            </tr>
            <tr v-else-if="dataPegawai.length === 0">
              <td colspan="6" class="text-center py-4 text-secondary">
                Data tidak ditemukan.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in dataPegawai" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>

              <td class="text-nowrap" v-if="!isManagerHRD">
                <div class="d-flex justify-content-center gap-1">
                  <NuxtLink
                    :to="`/pegawai/form/${item.id}`"
                    class="text-dark"
                    title="Edit"
                  >
                    <IconPencil stroke="1" size="20" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/pegawai/${item.id}`"
                    class="text-dark"
                    title="Detail"
                  >
                    <IconFileDescription stroke="1" size="20" />
                  </NuxtLink>
                  <a
                    href="#"
                    class="text-dark"
                    @click.prevent="downloadData('pdf', item)"
                    title="Download"
                  >
                    <IconCloudDownload stroke="1" size="20" />
                  </a>

                  <a
                    v-if="canDelete(item)"
                    href="#"
                    class="text-danger"
                    @click.prevent="bukaModalHapus(item)"
                    title="Hapus"
                  >
                    <IconTrash stroke="1" size="20" />
                  </a>
                </div>
              </td>

              <td>{{ item.nip }}</td>
              <td>{{ item.nama_pegawai }}</td>
              <td>{{ item.jabatan }}</td>
              <td>{{ formatDateID(item.tanggal_masuk) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Hapus -->
      <div
        class="modal modal-blur fade"
        :class="{ show: showDeleteModal }"
        :style="{ display: showDeleteModal ? 'block' : 'none' }"
      >
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button
              type="button"
              class="btn-close"
              @click="showDeleteModal = false"
            ></button>
            <div class="modal-status bg-danger"></div>
            <div class="modal-body text-center py-4">
              <svg
                class="icon mb-2 text-danger icon-lg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 9v4"></path>
                <path
                  d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"
                ></path>
              </svg>
              <h3>Hapus Data</h3>
              <div class="text-secondary">
                Apakah kamu ingin menghapus data
                <strong>{{ itemToDelete?.nama_pegawai }}</strong
                >?
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <a
                      href="#"
                      class="btn w-100"
                      @click.prevent="showDeleteModal = false"
                      >Batal</a
                    >
                  </div>
                  <div class="col">
                    <button
                      class="btn btn-danger w-100"
                      @click="konfirmasiHapus"
                      :disabled="isDeleting"
                    >
                      <span
                        v-if="isDeleting"
                        class="spinner-border spinner-border-sm"
                      ></span>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileDescription,
  IconCloudDownload,
} from "@tabler/icons-vue";
import { formatDateID } from "~/utils/formatDate.js";

definePageMeta({ title: "Data Pegawai", layout: false });
useSeoMeta({ title: "Data Pegawai" });

const search = ref("");
const jabatan = ref("");
const statusKontrak = ref("");
const masaKerjaMin = ref("");
const masaKerjaMax = ref("");

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

const currentUserRole = ref("");

onMounted(async () => {
  try {
    if (token) {
      const resUser = await $fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resUser.status === "success") {
        currentUserRole.value = resUser.user.role;
      }
    }
  } catch (err) {
    console.error("Gagal memuat profil user:", err);
  }
});

const isManagerHRD = computed(() => currentUserRole.value === "Manager HRD");
const isAdminHRD = computed(() => currentUserRole.value === "Admin HRD");

const {
  data: response,
  pending,
  refresh,
} = await useAsyncData(
  "pegawai-list",
  () =>
    $fetch("/api/pegawai", {
      headers: { Authorization: `Bearer ${token}` },
      query: {
        search: search.value,
        jabatan: jabatan.value,
        statusKontrak: statusKontrak.value,
        masaKerjaMin: masaKerjaMin.value,
        masaKerjaMax: masaKerjaMax.value,
      },
    }),
  {
    server: false,
    watch: [search, jabatan, statusKontrak, masaKerjaMin, masaKerjaMax],
  },
);

const dataPegawai = computed(() => response.value?.data || []);

const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

const canDelete = (item) => {
  const isTargetSuperadmin =
    item.nama_pegawai?.toLowerCase().includes("superadmin") ||
    item.jabatan?.toLowerCase().includes("superadmin");

  if (isAdminHRD.value && isTargetSuperadmin) {
    return false;
  }

  return true;
};

const bukaModalHapus = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const konfirmasiHapus = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await $fetch(`/api/pegawai/${itemToDelete.value.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
    showDeleteModal.value = false;
  } catch (err) {
    alert("Gagal menghapus data");
  } finally {
    isDeleting.value = false;
  }
};

const downloadData = (format, item) => {
  window.location.href = `/api/pegawai/download?format=${format}`;
};
</script>
