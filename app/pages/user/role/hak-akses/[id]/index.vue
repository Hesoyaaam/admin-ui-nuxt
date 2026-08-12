<template>
  <div>
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4 col-lg-3">
            <label for="" class="form-label">Nama Role</label>
            <input
              type="text"
              class="form-control"
              :value="roleData?.nama_role"
              disabled
            />
          </div>
          <div class="col-md-4 col-lg-3">
            <label for="" class="form-label">Deskripsi</label>
            <input
              type="text"
              class="form-control"
              :value="roleData?.deskripsi"
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Modul/Fitur</th>
              <th class="text-center">Akses</th>
              <th class="text-center">Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in roleData?.permissions" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.modul }}</td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.akses" class="text-green" />
                <IconXboxXFilled v-else class="text-red" />
              </td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.create" class="text-green" />
                <IconXboxXFilled v-else class="text-red" />
              </td>
              <td>{{ item.read }}</td>
              <td>{{ item.update }}</td>
              <td>{{ item.delete }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { IconCircleCheckFilled, IconXboxXFilled } from "@tabler/icons-vue";

definePageMeta({
  title: "Hak Akses",
});

useSeoMeta({
  title: "Hak Akses",
});

const route = useRoute();
const roleId = route.params.id;

const { data: response } = await useFetch(`/api/roles/${roleId}`);
const roleData = computed(() => response.value?.data);
</script>
