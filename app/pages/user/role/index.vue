<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex gap-2 ms-auto">
        <!-- Filter Role -->
        <select v-model="selectedRole" class="form-select" style="width: 180px">
          <option value="">Semua Role</option>
          <template v-for="(item, index) in manajemenRole" :key="index">
            <option :value="item.role">{{ item.role }}</option>
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
            <th>Role</th>
            <th>Deskripsi</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredRoles" :key="item.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.deskripsi }}</td>
            <td class="text-center">
              <NuxtLink
                :to="`/user/role/hak-akses/${item.id}`"
                class="btn btn-sm btn-primary"
              >
                Hak Akses
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="filteredRoles.length === 0">
            <td colspan="4" class="text-center py-4 text-muted">
              Data role tidak ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer d-flex align-items-center">
      <p class="m-0 text-secondary">
        Menampilkan <strong>{{ filteredRoles.length }}</strong> data role
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Manajemen Role",
});

useSeoMeta({
  title: "Manajemen Role",
});

import { ref, computed } from "vue";
import { IconSearch } from "@tabler/icons-vue";

const searchQuery = ref("");
const selectedRole = ref("");

const { data: response, error } = await useFetch("/api/roles");

const manajemenRole = computed(() => {
  return response.value?.data || [];
});

const filteredRoles = computed(() => {
  let result = manajemenRole.value;

  if (selectedRole.value) {
    result = result.filter((item) => item.role === selectedRole.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.role.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query),
    );
  }

  return result;
});
</script>
