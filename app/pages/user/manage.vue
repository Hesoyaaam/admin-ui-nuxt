<template>
  <NuxtLayout name="default">
    <template #actions>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modal-add"
        @click="resetForm"
      >
        <IconPlus :stroke="3" size="20" />Tambah
      </button>
    </template>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Filter Role -->
          <select
            class="form-select"
            v-model="selectedRole"
            style="width: 180px"
          >
            <option value="">Semua Role</option>
            <template v-for="(item, index) in roleOptions" :key="index">
              <option :value="item.value">{{ item.label }}</option>
            </template>
          </select>

          <!-- Search -->
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Cari Data ..."
            />
            <button class="btn" type="button">
              <IconSearch :stroke="2" />
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>
              <th width="15">Action</th>
              <th>Nama Pengguna</th>
              <th>Username</th>
              <th>Jabatan</th>
              <th>Departemen</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredUsers" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-nowrap">
                <div class="d-flex gap-2">
                  <!-- Aksi Edit -->
                  <a
                    href="#"
                    class="text-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-add"
                    @click="editUser(item)"
                  >
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Edit"
                    >
                      <IconPencil :stroke="1" size="20" />
                    </span>
                  </a>

                  <!-- Aksi Hapus -->
                  <a
                    href="#"
                    class="text-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-hapus"
                    @click="deleteId = item.id"
                  >
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Hapus"
                    >
                      <IconTrash :stroke="1" size="20" />
                    </span>
                  </a>
                </div>
              </td>
              <td>{{ item.nama }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.jabatan || "-" }}</td>
              <td>{{ item.departemen || "-" }}</td>
              <td>{{ item.role || "-" }}</td>
              <td>
                <span
                  class="text"
                  :class="item.status === 'Aktif' ? 'text-green' : 'text-red'"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                Data user tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex align-items-center">
        <p class="m-0 text-secondary">
          Menampilkan <strong>{{ filteredUsers.length }}</strong> data user
        </p>
      </div>

      <!-- Modal Tambah/Edit User -->
      <div class="modal modal-blur fade" id="modal-add" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEdit ? "Edit User" : "Tambah User" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <!-- NAMA (Autosuggest) -->
              <!-- NAMA (Autosuggest) -->
              <div
                class="mb-3 position-relative"
                style="overflow: visible !important"
              >
                <label class="form-label"
                  >Nama Lengkap (Pegawai)
                  <span class="text-danger">*</span></label
                >
                <input
                  v-model="searchPegawaiQuery"
                  @input="handleSearchPegawai"
                  @blur="hideSuggestions"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      searchPegawaiQuery.length >= 2 && !form.id_pegawai,
                  }"
                  placeholder="Ketik min. 2 huruf nama pegawai..."
                />
                <div
                  class="invalid-feedback"
                  v-if="errors.id_pegawai || errors.nama"
                >
                  {{ errors.id_pegawai || errors.nama }}
                </div>

                <ul
                  v-if="showSuggestions && pegawaiSuggestions.length > 0"
                  class="list-group position-absolute w-100 shadow bg-white"
                  style="
                    z-index: 9999;
                    max-height: 200px;
                    overflow-y: auto;
                    top: 100%;
                    left: 0;
                  "
                >
                  <li
                    v-for="pegawai in pegawaiSuggestions"
                    :key="pegawai.id"
                    class="list-group-item list-group-item-action"
                    style="cursor: pointer"
                    @mousedown.prevent="selectPegawai(pegawai)"
                  >
                    {{ pegawai.nama }}
                  </li>
                </ul>
              </div>

              <div class="mb-3">
                <label class="form-label"
                  >Username <span class="text-danger">*</span></label
                >
                <input
                  v-model="form.username"
                  @keyup="validateUsername"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': usernameError }"
                  placeholder="Min 6 char, huruf kecil & angka, tanpa spasi"
                />
                <div class="invalid-feedback" v-if="errors.username">
                  {{ errors.username }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label"
                  >Password <span class="text-danger">*</span></label
                >
                <div class="input-group">
                  <input
                    v-model="form.password"
                    @keyup="validatePassword"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': passwordError }"
                    placeholder="Ketik atau klik generate..."
                  />
                  <button
                    @click="generatePassword"
                    class="btn btn-outline-secondary"
                    type="button"
                  >
                    Generate
                  </button>
                </div>
                <div class="invalid-feedback d-block" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>

              =
              <div class="mb-3">
                <label class="form-label"
                  >Jabatan <span class="text-danger">*</span></label
                >
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle w-100 text-start border bg-white"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {{ selectedJabatanName || "Pilih Jabatan" }}
                  </button>
                  <div class="dropdown-menu w-100 p-2 shadow-sm">
                    <input
                      type="text"
                      class="form-control mb-2"
                      placeholder="Cari Jabatan..."
                      v-model="searchJabatan"
                      @click.stop
                    />
                    <ul
                      class="list-unstyled mb-0"
                      style="max-height: 150px; overflow-y: auto"
                    >
                      <li v-for="jab in filteredJabatan" :key="jab.id">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectJabatan(jab)"
                          >{{ jab.nama }}</a
                        >
                      </li>
                      <li
                        v-if="filteredJabatan.length === 0"
                        class="dropdown-item text-muted"
                      >
                        Data tidak ditemukan
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="text-danger fs-6 mt-1" v-if="errors.id_jabatan">
                  {{ errors.id_jabatan }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label"
                  >Departemen <span class="text-danger">*</span></label
                >
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle w-100 text-start border bg-white"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {{ selectedDepartemenName || "Pilih Departemen" }}
                  </button>
                  <div class="dropdown-menu w-100 p-2 shadow-sm">
                    <input
                      type="text"
                      class="form-control mb-2"
                      placeholder="Cari Departemen..."
                      v-model="searchDepartemen"
                      @click.stop
                    />
                    <ul
                      class="list-unstyled mb-0"
                      style="max-height: 150px; overflow-y: auto"
                    >
                      <li v-for="dep in filteredDepartemen" :key="dep.id">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDepartemen(dep)"
                          >{{ dep.nama }}</a
                        >
                      </li>
                      <li
                        v-if="filteredDepartemen.length === 0"
                        class="dropdown-item text-muted"
                      >
                        Data tidak ditemukan
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="text-danger fs-6 mt-1" v-if="errors.id_departemen">
                  {{ errors.id_departemen }}
                </div>
              </div>

              <!-- ROLE -->
              <div class="mb-3">
                <label class="form-label"
                  >Role <span class="text-danger">*</span></label
                >
                <select v-model="form.id_role" class="form-select">
                  <option value="" selected disabled>Pilih Role</option>
                  <option value="1">Superadmin</option>
                  <option value="2">Manager HRD</option>
                  <option value="3">Admin HRD</option>
                </select>
                <div class="invalid-feedback" v-if="errors.id_role">
                  {{ errors.id_role }}
                </div>
              </div>

              <!-- STATUS -->
              <div>
                <label class="form-label">Status</label>
                <label class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.is_aktif"
                  />
                  <span class="form-check-label">Aktif</span>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" data-bs-dismiss="modal">
                Kembali
              </button>
              <button type="button" class="btn btn-primary" @click="saveUser">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal modal-blur fade" id="modal-hapus" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <h3>Apakah Anda yakin?</h3>
            <p class="text-secondary">
              Data user yang dihapus tidak dapat dikembalikan.
            </p>
          </div>
          <div class="modal-footer">
            <div class="w-100">
              <div class="row">
                <div class="col">
                  <button
                    type="button"
                    class="btn w-100"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                </div>
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-danger w-100"
                    data-bs-dismiss="modal"
                    @click="confirmDelete"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { IconPlus, IconSearch, IconPencil, IconTrash } from "@tabler/icons-vue";
import { userSchema } from "~/utils/schemas";

definePageMeta({
  title: "Manajemen User",
  layout: false,
});

useSeoMeta({
  title: "Manajemen User",
});

const roleOptions = ref([
  { label: "Superadmin", value: "Superadmin" },
  { label: "Manager HRD", value: "Manager HRD" },
  { label: "Admin HRD", value: "Admin HRD" },
]);

const selectedRole = ref("");
const searchQuery = ref("");
const isEdit = ref(false);

const form = reactive({
  id: null,
  nama: "",
  username: "",
  password: "",
  id_pegawai: null,
  id_jabatan: "",
  id_departemen: "",
  id_role: "",
  is_aktif: true,
});

const errors = reactive({
  nama: "",
  id_pegawai: "",
  username: "",
  password: "",
  id_jabatan: "",
  id_departemen: "",
  id_role: "",
});

const resetForm = () => {
  isEdit.value = false;
  Object.assign(form, {
    id: null,
    nama: "",
    username: "",
    password: "",
    id_pegawai: null,
    id_jabatan: "",
    id_departemen: "",
    id_role: "",
    is_aktif: true,
  });

  Object.keys(errors).forEach((key) => (errors[key] = ""));

  searchPegawaiQuery.value = "";
  selectedJabatanName.value = "";
  selectedDepartemenName.value = "";
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  const result = userSchema.safeParse(form);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && errors.hasOwnProperty(field)) {
        errors[field] = issue.message;
      }
    });
    return false;
  }

  return true;
};

const validateField = (fieldName) => {
  const result = userSchema.safeParse(form);
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === fieldName);
    errors[fieldName] = issue ? issue.message : "";
  } else {
    errors[fieldName] = "";
  }
};

const searchPegawaiQuery = ref("");
const pegawaiSuggestions = ref([]);
const showSuggestions = ref(false);
let debounceTimer = null;

const handleSearchPegawai = () => {
  form.id_pegawai = null;
  form.nama = "";
  showSuggestions.value = false;

  if (searchPegawaiQuery.value.length >= 2) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await $fetch(
          `/api/users/pegawai?search=${searchPegawaiQuery.value}`,
        );

        let rawData = res?.data || [];
        if (rawData && !Array.isArray(rawData) && typeof rawData === "object") {
          rawData = [rawData];
        }

        pegawaiSuggestions.value = rawData;
        showSuggestions.value = rawData.length > 0;
      } catch (error) {
        pegawaiSuggestions.value = [];
      }
    }, 300);
  }
};

const selectPegawai = (pegawai) => {
  form.id_pegawai = pegawai.id;
  form.nama = pegawai.nama;
  searchPegawaiQuery.value = pegawai.nama;
  showSuggestions.value = false;

  validateField("id_pegawai");
};

const hideSuggestions = () => {
  setTimeout(() => (showSuggestions.value = false), 200);
};

const generatePassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  let pass = [
    upper.charAt(Math.floor(Math.random() * upper.length)),
    lower.charAt(Math.floor(Math.random() * lower.length)),
    numbers.charAt(Math.floor(Math.random() * numbers.length)),
    symbols.charAt(Math.floor(Math.random() * symbols.length)),
  ];

  const allChars = upper + lower + numbers + symbols;
  for (let i = 4; i < 10; i++) {
    pass.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
  }

  form.password = pass.sort(() => Math.random() - 0.5).join("");
  validateField("password");
};

const searchJabatan = ref("");
const selectedJabatanName = ref("");
const masterJabatan = ref([
  { id: 1, nama: "Manager" },
  { id: 2, nama: "System Analist" },
  { id: 3, nama: "Akuntan" },
  { id: 4, nama: "Programmer" },
]);
const filteredJabatan = computed(() => {
  return masterJabatan.value.filter((j) =>
    j.nama.toLowerCase().includes(searchJabatan.value.toLowerCase()),
  );
});
const selectJabatan = (jabatan) => {
  form.id_jabatan = jabatan.id;
  selectedJabatanName.value = jabatan.nama;
  searchJabatan.value = "";
  validateField("id_jabatan");
};

const searchDepartemen = ref("");
const selectedDepartemenName = ref("");
const masterDepartemen = ref([
  { id: 1, nama: "Produksi" },
  { id: 2, nama: "Marketing" },
  { id: 3, nama: "Finance" },
]);
const filteredDepartemen = computed(() => {
  return masterDepartemen.value.filter((d) =>
    d.nama.toLowerCase().includes(searchDepartemen.value.toLowerCase()),
  );
});
const selectDepartemen = (dep) => {
  form.id_departemen = dep.id;
  selectedDepartemenName.value = dep.nama;
  searchDepartemen.value = "";
  validateField("id_departemen");
};

const saveUser = async () => {
  if (!validateForm()) return;

  try {
    const method = isEdit.value ? "PUT" : "POST";
    const endpoint = isEdit.value ? `/api/users/${form.id}` : "/api/users";

    const res = await $fetch(endpoint, {
      method: method,
      body: form,
    });

    if (res.status === "success") {
      alert(res.message);
      window.location.reload();
    }
  } catch (error) {
    alert(
      error.data?.statusMessage || "Terjadi kesalahan saat menyimpan data.",
    );
  }
};

const editUser = (user) => {
  resetForm();
  isEdit.value = true;
  Object.assign(form, user);

  searchPegawaiQuery.value = user.nama || "";

  const jab = masterJabatan.value.find((j) => j.id == user.id_jabatan);
  if (jab) selectedJabatanName.value = jab.nama;

  const dep = masterDepartemen.value.find((d) => d.id == user.id_departemen);
  if (dep) selectedDepartemenName.value = dep.nama;
};

const { data: response } = await useFetch("/api/users");
const users = computed(() => response.value?.data || []);

const filteredUsers = computed(() => {
  let result = users.value;

  if (selectedRole.value) {
    result = result.filter((item) => item.role === selectedRole.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        (item.nama && item.nama.toLowerCase().includes(query)) ||
        (item.username && item.username.toLowerCase().includes(query)) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(query)) ||
        (item.departemen && item.departemen.toLowerCase().includes(query)),
    );
  }

  return result;
});

const deleteId = ref(null);

const confirmDelete = async () => {
  if (!deleteId.value) return;

  try {
    const res = await $fetch(`/api/users/${deleteId.value}`, {
      method: "DELETE",
    });

    if (res.status === "success") {
      alert(res.message);
      window.location.reload();
    }
  } catch (error) {
    alert(
      error.data?.statusMessage || "Terjadi kesalahan saat menghapus data.",
    );
  }
};
</script>
