<template>
  <div class="row justify-content-center g-3">
    <!-- Kolom Tunggal untuk Data Diri (Full Width / Lebar Penuh) -->
    <div class="col-lg-10">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">My Profile - Data Diri</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div class="col-12">
              <div class="row align-items-center">
                <!-- Foto -->
                <div class="col-auto">
                  <img
                    :src="form.foto || '/images/pegawai/ahmad.jpg'"
                    alt="Foto Profil"
                    class="foto-ptofil object-fit-cover"
                  />
                  <label
                    v-if="isUpdateMode"
                    for="unggah-foto"
                    class="form-label text-primary text-center cursor-pointer mt-2"
                    >Ubah Foto</label
                  >
                  <input
                    id="unggah-foto"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    hidden
                    @change="handleFileUpload"
                    :disabled="!isUpdateMode"
                  />
                </div>

                <div class="col">
                  <!-- NIP -->
                  <div class="mb-4">
                    <label class="form-label">NIP</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.nip"
                      :disabled="!isUpdateMode"
                    />
                  </div>

                  <!-- Nama Lengkap -->
                  <div>
                    <label class="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.nama_pegawai"
                      :disabled="!isUpdateMode"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model="form.email"
                :disabled="!isUpdateMode"
              />
            </div>

            <!-- No HP -->
            <div class="col-md-6">
              <label class="form-label">Nomor HP</label>
              <input
                type="text"
                class="form-control"
                v-model="form.nomor_hp"
                :disabled="!isUpdateMode"
              />
            </div>

            <!-- Tempat Lahir -->
            <div class="col-md-5">
              <label class="form-label">Tempat Lahir</label>
              <input
                type="text"
                class="form-control"
                v-model="form.tempat_lahir"
                :disabled="!isUpdateMode"
              />
            </div>

            <!-- Tanggal Lahir -->
            <div class="col-md-5">
              <label class="form-label">Tanggal Lahir</label>
              <input
                type="date"
                class="form-control"
                v-model="form.tanggal_lahir"
                @change="hitungUsia"
                :disabled="!isUpdateMode"
              />
            </div>

            <!-- Usia (Otomatis) -->
            <div class="col-md-2">
              <label class="form-label">Usia</label>
              <input
                type="number"
                min="0"
                class="form-control"
                v-model="form.usia"
                readonly
              />
            </div>

            <!-- Pendidikan (Form Dinamis) -->
            <div class="col-12">
              <div class="card bg-light-subtle">
                <div class="card-body">
                  <label class="form-label fw-bold">Pendidikan</label>
                  <table class="table table-borderless align-middle">
                    <thead>
                      <tr>
                        <th class="py-0">Jenjang</th>
                        <th class="py-0">Nama Sekolah / Perguruan Tinggi</th>
                        <th class="py-0">Tahun Lulus</th>
                        <th class="py-0" v-if="isUpdateMode"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(edu, index) in form.riwayat_pendidikan"
                        :key="index"
                      >
                        <td>
                          <input
                            type="text"
                            class="form-control"
                            v-model="edu.tingkat"
                            :disabled="!isUpdateMode"
                            placeholder="Cth: S1"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            class="form-control"
                            v-model="edu.nama_sekolah"
                            :disabled="!isUpdateMode"
                            placeholder="Nama Sekolah"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            class="form-control"
                            v-model="edu.tahun_lulus"
                            :disabled="!isUpdateMode"
                            placeholder="Tahun"
                          />
                        </td>
                        <td v-if="isUpdateMode">
                          <IconXboxXFilled
                            class="text-red cursor-pointer"
                            size="20"
                            @click="hapusPendidikan(index)"
                          />
                        </td>
                      </tr>
                      <tr v-if="form.riwayat_pendidikan.length === 0">
                        <td colspan="4" class="text-center text-secondary py-2">
                          Belum ada riwayat pendidikan
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="text-center mt-3" v-if="isUpdateMode">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="tambahPendidikan"
                    >
                      TAMBAH PENDIDIKAN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alamat Lengkap -->
            <div class="col-12">
              <label class="form-label">Alamat Lengkap</label>
              <textarea
                class="form-control"
                rows="3"
                v-model="form.alamat_lengkap"
                :disabled="!isUpdateMode"
              ></textarea>
            </div>

            <!-- Kecamatan -->
            <div class="col-md-4">
              <label class="form-label">Kecamatan</label>
              <select
                class="form-select"
                v-model="form.id_kecamatan"
                :disabled="!isUpdateMode"
              >
                <option value="" disabled>Pilih kecamatan</option>
                <option value="1">Danurejan</option>
                <option value="2">Gedongtengen</option>
                <option value="3">Gondokusuman</option>
                <option value="4">Jetis</option>
              </select>
            </div>

            <!-- Kabupaten -->
            <div class="col-md-4">
              <label class="form-label">Kabupaten</label>
              <select class="form-select" v-model="form.kabupaten" disabled>
                <option value="">Yogyakarta / Sleman dll</option>
              </select>
            </div>

            <!-- Provinsi -->
            <div class="col-md-4">
              <label class="form-label">Provinsi</label>
              <select class="form-select" v-model="form.provinsi" disabled>
                <option value="">Yogyakarta</option>
              </select>
            </div>

            <!-- Status Pernikahan -->
            <div class="col-md-6">
              <div class="form-label">Status Pernikahan</div>
              <div>
                <label class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="status_kawin"
                    value="Belum Menikah"
                    v-model="form.status_kawin"
                    :disabled="!isUpdateMode"
                  />
                  <span class="form-check-label">Belum Menikah</span>
                </label>
                <label class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="status_kawin"
                    value="Menikah"
                    v-model="form.status_kawin"
                    :disabled="!isUpdateMode"
                  />
                  <span class="form-check-label">Menikah</span>
                </label>
              </div>
            </div>

            <!-- Jumlah Anak -->
            <div class="col-md-6">
              <label class="form-label">Jumlah Anak</label>
              <input
                type="number"
                min="0"
                class="form-control"
                v-model="form.jumlah_anak"
                :disabled="!isUpdateMode"
              />
            </div>
          </div>
        </div>

        <!-- Footer Tombol Aksi -->
        <div class="card-footer d-flex" v-if="isUpdateMode">
          <div class="d-flex gap-2 ms-auto">
            <button
              class="btn btn-primary"
              @click="simpanProfil"
              :disabled="loading"
            >
              {{ loading ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
            <button class="btn btn-outline-primary" @click="router.back()">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { IconXboxXFilled } from "@tabler/icons-vue";

definePageMeta({
  title: "My Profile",
});

const router = useRouter();
const loading = ref(false);
const isUpdateMode = ref(true);

const form = ref({
  nip: "",
  nama_pegawai: "",
  email: "",
  nomor_hp: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  usia: 0,
  alamat_lengkap: "",
  id_kecamatan: "",
  kabupaten: "",
  provinsi: "",
  status_kawin: "Belum Menikah",
  jumlah_anak: 0,
  foto: null,
  riwayat_pendidikan: [],
});

const hitungUsia = () => {
  if (!form.value.tanggal_lahir) {
    form.value.usia = 0;
    return;
  }
  const birthDate = new Date(form.value.tanggal_lahir);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  form.value.usia = age >= 0 ? age : 0;
};

const tambahPendidikan = () => {
  form.value.riwayat_pendidikan.push({
    tingkat: "",
    nama_sekolah: "",
    tahun_lulus: "",
  });
};

const hapusPendidikan = (index) => {
  form.value.riwayat_pendidikan.splice(index, 1);
};

const fetchMyProfile = async () => {
  try {
    const res = await $fetch("/api/profile");
    if (res && res.status === "success") {
      const data = res.data;

      if (data.tanggal_lahir) {
        data.tanggal_lahir = data.tanggal_lahir.split("T")[0];
      }

      const rawStatus = String(data.status_kawin || "").toLowerCase();
      if (rawStatus.includes("kawin") && !rawStatus.includes("belum")) {
        data.status_kawin = "Menikah";
      } else {
        data.status_kawin = "Belum Menikah";
      }

      form.value = { ...form.value, ...data };
      hitungUsia();
    }
  } catch (error) {
    console.error("Gagal memuat data profil:", error);
  }
};

const simpanProfil = async () => {
  loading.value = true;
  try {
    await $fetch("/api/profile", {
      method: "PUT",
      body: form.value,
    });
    alert("Profil berhasil diperbarui!");
  } catch (error) {
    alert(
      error.data?.statusMessage || "Terjadi kesalahan saat menyimpan profil.",
    );
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
  }
};

onMounted(() => {
  fetchMyProfile();
});
</script>

<style scoped>
.foto-ptofil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
