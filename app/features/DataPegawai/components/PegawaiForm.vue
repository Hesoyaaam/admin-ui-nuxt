<template>
  <div class="row g-3">
    <div v-if="pendingFetch" class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-secondary">Memuat data pegawai...</div>
    </div>

    <template v-else>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Diri</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-12">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <img
                      :src="imagePreview || '/images/pegawai/ahmad.jpg'"
                      alt="Foto Profil"
                      class="foto-ptofil"
                      style="object-fit: cover"
                    />
                    <label
                      for="unggah-foto"
                      class="form-label text-primary text-center cursor-pointer mt-2 mb-0 d-block"
                      >Ubah Foto</label
                    >
                    <input
                      id="unggah-foto"
                      type="file"
                      hidden
                      @change="handleFileUpload"
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </div>

                  <div class="col">
                    <div class="mb-4">
                      <label class="form-label"
                        >NIP <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        v-model="form.nip"
                        class="form-control"
                        :class="{ 'is-invalid': errors.nip }"
                        placeholder="Masukkan NIP"
                      />
                      <div class="invalid-feedback" v-if="errors.nip">
                        {{ errors.nip }}
                      </div>
                    </div>

                    <div>
                      <label class="form-label"
                        >Nama Lengkap <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        v-model="form.nama_pegawai"
                        class="form-control"
                        :class="{ 'is-invalid': errors.nama_pegawai }"
                        placeholder="Masukkan Nama Lengkap"
                      />
                      <div class="invalid-feedback" v-if="errors.nama_pegawai">
                        {{ errors.nama_pegawai }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label"
                  >Email <span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  v-model="form.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="email@contoh.com"
                />
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label"
                  >Nomor HP <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  v-model="form.nomor_hp"
                  class="form-control"
                  :class="{ 'is-invalid': errors.nomor_hp }"
                  placeholder="+62..."
                />
                <div class="invalid-feedback" v-if="errors.nomor_hp">
                  {{ errors.nomor_hp }}
                </div>
              </div>

              <div class="col-md-5">
                <label class="form-label">Tempat Lahir</label>
                <input
                  type="text"
                  v-model="form.tempat_lahir"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tempat_lahir }"
                />
                <div class="invalid-feedback" v-if="errors.tempat_lahir">
                  {{ errors.tempat_lahir }}
                </div>
              </div>

              <div class="col-md-5">
                <label class="form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  v-model="form.tanggal_lahir"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tanggal_lahir }"
                />
                <div class="invalid-feedback" v-if="errors.tanggal_lahir">
                  {{ errors.tanggal_lahir }}
                </div>
              </div>

              <div class="col-md-2">
                <label class="form-label">Usia</label>
                <input
                  type="number"
                  v-model="form.usia"
                  class="form-control bg-light"
                  readonly
                  placeholder="0"
                />
              </div>

              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <label class="form-label">Pendidikan</label>
                    <div class="table-responsive">
                      <table class="table table-borderless align-middle mb-0">
                        <thead>
                          <tr>
                            <th class="py-0">Jenjang</th>
                            <th class="py-0">
                              Nama Sekolah / Perguruan Tinggi
                            </th>
                            <th class="py-0">Tahun Lulus</th>
                            <th class="py-0"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="form.riwayat_pendidikan.length === 0">
                            <td
                              colspan="4"
                              class="text-center text-secondary py-2"
                            >
                              Belum ada data pendidikan
                            </td>
                          </tr>

                          <tr
                            v-for="(edu, index) in form.riwayat_pendidikan"
                            :key="index"
                          >
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                :class="{
                                  'is-invalid':
                                    errors[
                                      `riwayat_pendidikan.${index}.tingkat`
                                    ],
                                }"
                                v-model="edu.tingkat"
                                placeholder="Contoh: S1"
                              />
                              <div
                                class="invalid-feedback d-block"
                                v-if="
                                  errors[`riwayat_pendidikan.${index}.tingkat`]
                                "
                              >
                                {{
                                  errors[`riwayat_pendidikan.${index}.tingkat`]
                                }}
                              </div>
                            </td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                :class="{
                                  'is-invalid':
                                    errors[
                                      `riwayat_pendidikan.${index}.nama_sekolah`
                                    ],
                                }"
                                v-model="edu.nama_sekolah"
                                placeholder="Nama instansi"
                              />
                              <div
                                class="invalid-feedback d-block"
                                v-if="
                                  errors[
                                    `riwayat_pendidikan.${index}.nama_sekolah`
                                  ]
                                "
                              >
                                {{
                                  errors[
                                    `riwayat_pendidikan.${index}.nama_sekolah`
                                  ]
                                }}
                              </div>
                            </td>
                            <td>
                              <input
                                type="number"
                                class="form-control"
                                :class="{
                                  'is-invalid':
                                    errors[
                                      `riwayat_pendidikan.${index}.tahun_lulus`
                                    ],
                                }"
                                v-model="edu.tahun_lulus"
                                placeholder="YYYY"
                              />
                              <div
                                class="invalid-feedback d-block"
                                v-if="
                                  errors[
                                    `riwayat_pendidikan.${index}.tahun_lulus`
                                  ]
                                "
                              >
                                {{
                                  errors[
                                    `riwayat_pendidikan.${index}.tahun_lulus`
                                  ]
                                }}
                              </div>
                            </td>
                            <td>
                              <IconXboxXFilled
                                class="text-red cursor-pointer"
                                @click="hapusPendidikan(index)"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-center mt-3">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="tambahPendidikan"
                      >
                        TAMBAH DATA
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label class="form-label">Alamat Lengkap</label>
                <textarea
                  v-model="form.alamat_lengkap"
                  class="form-control"
                  :class="{ 'is-invalid': errors.alamat_lengkap }"
                  rows="3"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
                <div class="invalid-feedback" v-if="errors.alamat_lengkap">
                  {{ errors.alamat_lengkap }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Kecamatan</label>
                <select
                  v-model="form.id_kecamatan"
                  class="form-select"
                  :class="{ 'is-invalid': errors.id_kecamatan }"
                >
                  <option value="" disabled>Pilih kecamatan</option>
                  <option value="1">Danurejan</option>
                  <option value="2">Gedongtengen</option>
                  <option value="3">Gondokusuman</option>
                  <option value="4">Jetis</option>
                </select>
                <div class="invalid-feedback" v-if="errors.id_kecamatan">
                  {{ errors.id_kecamatan }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Kabupaten</label>
                <select class="form-select">
                  <option value="" selected disabled>Pilih kabupaten</option>
                  <option value="Bantul">Bantul</option>
                  <option value="Sleman">Sleman</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">Provinsi</label>
                <select class="form-select">
                  <option value="" selected disabled>Pilih provinsi</option>
                  <option value="DIY">D.I. Yogyakarta</option>
                  <option value="Jateng">Jawa Tengah</option>
                </select>
              </div>

              <div class="col-md-6">
                <div class="form-label">Status Pernikahan</div>
                <div>
                  <label class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      :class="{ 'is-invalid': errors.status_kawin }"
                      type="radio"
                      v-model="form.status_kawin"
                      value="tidak kawin"
                    />
                    <span class="form-check-label">Belum Menikah</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      :class="{ 'is-invalid': errors.status_kawin }"
                      type="radio"
                      v-model="form.status_kawin"
                      value="kawin"
                    />
                    <span class="form-check-label">Menikah</span>
                  </label>
                </div>
                <div class="text-danger small mt-1" v-if="errors.status_kawin">
                  {{ errors.status_kawin }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Jumlah Anak</label>
                <input
                  type="number"
                  min="0"
                  v-model="form.jumlah_anak"
                  class="form-control"
                  :class="{ 'is-invalid': errors.jumlah_anak }"
                />
                <div class="invalid-feedback" v-if="errors.jumlah_anak">
                  {{ errors.jumlah_anak }}
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
              <div class="col-12">
                <label class="form-label">Tanggal Masuk</label>
                <input
                  type="date"
                  v-model="form.tanggal_masuk"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tanggal_masuk }"
                />
                <div class="invalid-feedback" v-if="errors.tanggal_masuk">
                  {{ errors.tanggal_masuk }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Jabatan</label>
                <select
                  v-model="form.id_jabatan"
                  class="form-select"
                  :class="{ 'is-invalid': errors.id_jabatan }"
                >
                  <option value="" disabled>Pilih jabatan</option>
                  <option value="1">Manager</option>
                  <option value="2">System Analist</option>
                  <option value="3">Akuntan</option>
                  <option value="4">Programmer</option>
                </select>
                <div class="invalid-feedback" v-if="errors.id_jabatan">
                  {{ errors.id_jabatan }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Departemen</label>
                <select
                  v-model="form.id_departemen"
                  class="form-select"
                  :class="{ 'is-invalid': errors.id_departemen }"
                >
                  <option value="" disabled>Pilih departemen</option>
                  <option value="1">Produksi</option>
                  <option value="2">Marketing</option>
                  <option value="3">Finance</option>
                </select>
                <div class="invalid-feedback" v-if="errors.id_departemen">
                  {{ errors.id_departemen }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Status</label>
                <label class="form-check form-switch form-switch-3">
                  <input
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.status }"
                    type="checkbox"
                    v-model="form.status"
                    true-value="Aktif"
                    false-value="Nonaktif"
                  />
                  <span class="form-check-label">{{ form.status }}</span>
                </label>
                <div class="text-danger small mt-1" v-if="errors.status">
                  {{ errors.status }}
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <div class="d-flex gap-2 ms-auto">
              <button
                class="btn btn-primary"
                @click="simpanData"
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
                @click="goBack()"
                :disabled="isSubmitting"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IconXboxXFilled } from "@tabler/icons-vue";
import { pegawaiSchema } from "~/utils/schemas";

const { goBack } = useGoBack();
const route = useRoute();
const router = useRouter();

const idPegawai = route.params.id;
const isEditMode = computed(() => !!idPegawai);

const pendingFetch = ref(false);
const isSubmitting = ref(false);

const errors = ref({});

const form = ref({
  nip: "",
  nama_pegawai: "",
  email: "",
  nomor_hp: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  usia: "",
  alamat_lengkap: "",
  id_kecamatan: "",
  status_kawin: "tidak kawin",
  jumlah_anak: 0,
  tanggal_masuk: "",
  id_jabatan: "",
  id_departemen: "",
  status: "Aktif",
  riwayat_pendidikan: [],
});

const imagePreview = ref(null);

watch(
  () => form.value.tanggal_lahir,
  (newVal) => {
    if (newVal) {
      const birthDate = new Date(newVal);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      form.value.usia = age >= 0 ? age : 0;
    } else {
      form.value.usia = "";
    }
  },
);

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

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.foto_pegawai_file = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

onMounted(async () => {
  if (isEditMode.value) {
    pendingFetch.value = true;
    try {
      const token = localStorage.getItem("token") || "";
      const res = await $fetch(`/api/pegawai/${idPegawai}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res && res.data) {
        Object.assign(form.value, res.data);
        if (form.value.tanggal_lahir) {
          form.value.tanggal_lahir = new Date(form.value.tanggal_lahir)
            .toISOString()
            .split("T")[0];
        }
        if (form.value.tanggal_masuk) {
          form.value.tanggal_masuk = new Date(form.value.tanggal_masuk)
            .toISOString()
            .split("T")[0];
        }
        if (res.data.foto_pegawai) {
          imagePreview.value = `/images/pegawai/${res.data.foto_pegawai}`;
        }
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data pegawai.");
    } finally {
      pendingFetch.value = false;
    }
  }
});

const simpanData = async () => {
  errors.value = {};

  const dataToValidate = {
    ...form.value,
    id_kecamatan: form.value.id_kecamatan
      ? Number(form.value.id_kecamatan)
      : null,
    id_jabatan: form.value.id_jabatan ? Number(form.value.id_jabatan) : null,
    id_departemen: form.value.id_departemen
      ? Number(form.value.id_departemen)
      : null,
    jumlah_anak: form.value.jumlah_anak ? Number(form.value.jumlah_anak) : 0,
    riwayat_pendidikan: form.value.riwayat_pendidikan.map((edu) => ({
      ...edu,
      tahun_lulus: edu.tahun_lulus ? Number(edu.tahun_lulus) : null,
    })),
  };

  const parsedData = pegawaiSchema.safeParse(dataToValidate);

  if (!parsedData.success) {
    parsedData.error.issues.forEach((issue) => {
      const field = issue.path.join(".");

      if (!errors.value[field]) {
        errors.value[field] = issue.message;
      }
    });

    alert(
      "Terdapat isian yang belum valid. Silakan periksa kembali form Anda.",
    );
    return;
  }

  isSubmitting.value = true;
  try {
    const token = localStorage.getItem("token") || "";
    const method = isEditMode.value ? "PUT" : "POST";
    const endpoint = isEditMode.value
      ? `/api/pegawai/${idPegawai}`
      : `/api/pegawai`;

    const payload = {
      ...parsedData.data,
      foto_pegawai_file: form.value.foto_pegawai_file,
    };

    const res = await $fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    if (res.status === "success") {
      alert(
        isEditMode.value
          ? "Data berhasil diperbarui!"
          : "Data berhasil ditambahkan!",
      );
      router.push("/pegawai");
    }
  } catch (error) {
    console.error(error);
    alert(
      error.data?.statusMessage ||
        "Terjadi kesalahan saat menyimpan data. Periksa kembali form isian Anda.",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.foto-ptofil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid #e6e8eb;
}
</style>
