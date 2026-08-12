<template>
  <NuxtLayout name="default">
    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-secondary">Memuat data pegawai...</div>
    </div>

    <div
      v-else-if="error || !pegawai"
      class="alert alert-danger text-center mt-3"
    >
      Data pegawai tidak ditemukan atau terjadi kesalahan.
    </div>
    <div class="row g-3">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Diri</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-12">
                <div class="row align-items-center">
                  <!-- Foto -->
                  <div class="col-auto">
                    <img
                      :src="
                        pegawai.foto_pegawai
                          ? `/images/pegawai/${pegawai.foto_pegawai}`
                          : '/images/pegawai/ahmad.jpg'
                      "
                      alt="Foto Profil"
                      class="foto-ptofil"
                      style="object-fit: cover"
                    />
                  </div>

                  <div class="col">
                    <!-- NIP -->
                    <div class="datagrid-item mb-4">
                      <div class="datagrid-title">NIP</div>
                      <div class="datagrid-content">
                        {{ pegawai.nip || "-" }}
                      </div>
                    </div>

                    <!-- Nama Lengkap -->
                    <div class="datagrid-item">
                      <div class="datagrid-title">Nama Lengkap</div>
                      <div class="datagrid-content">
                        {{ pegawai.nama_pegawai || "-" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Email</div>
                  <div class="datagrid-content">{{ pegawai.email || "-" }}</div>
                </div>
              </div>

              <!-- No HP -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Nomor HP</div>
                  <div class="datagrid-content">
                    {{ pegawai.nomor_hp || "-" }}
                  </div>
                </div>
              </div>

              <!-- Tempat Lahir -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tempat Lahir</div>
                  <div class="datagrid-content">
                    {{ pegawai.tempat_lahir || "-" }}
                  </div>
                </div>
              </div>

              <!-- Tanggal Lahir -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tanggal Lahir</div>
                  <div class="datagrid-content">
                    {{
                      pegawai.tanggal_lahir
                        ? formatDateID(pegawai.tanggal_lahir)
                        : "-"
                    }}
                  </div>
                </div>
              </div>

              <!-- Usia -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Usia</div>
                  <div class="datagrid-content">
                    {{ pegawai.usia !== null ? `${pegawai.usia} tahun` : "-" }}
                  </div>
                </div>
              </div>

              <!-- Pendidikan -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Pendidikan</div>
                  <template
                    v-if="
                      pegawai.riwayat_pendidikan &&
                      pegawai.riwayat_pendidikan.length > 0
                    "
                  >
                    <div
                      class="datagrid-content"
                      v-for="edu in pegawai.riwayat_pendidikan"
                      :key="edu.id"
                    >
                      {{ edu.tingkat }} / {{ edu.nama_sekolah }} /
                      {{ edu.tahun_lulus }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="datagrid-content">-</div>
                  </template>
                </div>
              </div>

              <!-- Alamat Lengkap -->
              <div class="col-12">
                <div class="datagrid-item">
                  <div class="datagrid-title">Alamat Lengkap</div>
                  <div class="datagrid-content">
                    {{ pegawai.alamat_lengkap || "-" }}
                  </div>
                </div>
              </div>

              <!-- Kecamatan -->
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Kecamatan</div>
                  <div class="datagrid-content">
                    {{ pegawai.nama_kecamatan || "-" }}
                  </div>
                </div>
              </div>

              <!-- Kabupaten -->
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Kabupaten</div>
                  <div class="datagrid-content">
                    {{ pegawai.nama_kabupaten || "-" }}
                  </div>
                </div>
              </div>

              <!-- Provinsi -->
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Provinsi</div>
                  <div class="datagrid-content">
                    {{ pegawai.nama_provinsi || "-" }}
                  </div>
                </div>
              </div>

              <!-- Status Pernikahan -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Status Pernikahan</div>
                  <div class="datagrid-content text-capitalize">
                    {{ pegawai.status_kawin || "-" }}
                  </div>
                </div>
              </div>

              <!-- Jumlah Anak -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-content">
                    {{ pegawai.jumlah_anak || "0" }}
                  </div>
                  <div class="datagrid-content">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Kepegawaian</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <!-- Tanggal Masuk -->
              <div class="col-12">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tanggal Masuk</div>
                  <div class="datagrid-content">
                    {{
                      pegawai.tanggal_masuk
                        ? formatDateID(pegawai.tanggal_masuk)
                        : "-"
                    }}
                  </div>
                </div>
              </div>

              <!-- Jabatan -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Jabatan</div>
                  <div class="datagrid-content">
                    {{ pegawai.nama_jabatan || "-" }}
                  </div>
                </div>
              </div>

              <!-- Departemen -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Departemen</div>
                  <div class="datagrid-content">
                    {{ pegawai.nama_departemen || "-" }}
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Status</div>
                  <div class="datagrid-content">
                    {{ pegawai.status || "-" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <div class="ms-auto">
              <button class="btn btn-outline-primary" @click="goBack()">
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { formatDateID } from "~/utils/formatDate.js";

definePageMeta({
  title: "Detail Pegawai",
  layout: false,
});

useSeoMeta({
  title: "Detail Pegawai",
});

const { goBack } = useGoBack();
const route = useRoute();

const idPegawai = route.params.id || route.params.nip || route.params.nipp;

const {
  data: responseData,
  pending,
  error,
} = await useAsyncData(
  `pegawai-detail-${idPegawai}`,
  async () => {
    if (!idPegawai || idPegawai === "undefined") {
      console.warn("ID Pegawai tidak ditemukan di URL");
      return null;
    }

    const token = localStorage.getItem("token") || "";

    return await $fetch(`/api/pegawai/${idPegawai}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  {
    server: false,
  },
);

const pegawai = computed(() => responseData.value?.data || null);
</script>

<style scoped>
.foto-ptofil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
