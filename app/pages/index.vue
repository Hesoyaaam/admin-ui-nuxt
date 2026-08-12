<script setup>
definePageMeta({
  title: "Dashboard",
});

useSeoMeta({
  title: "Dashboard",
});

import { ref, onMounted } from "vue";

const userRole = ref("");
const userName = ref("");
const dashboardData = ref(null);

const statusPegawaiSeries = ref([0, 0, 0]);
const genderPegawaiSeries = ref([0, 0]);

const statusPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["PKWT", "PKWTT", "Magang"],
  colors: [
    "rgba(84, 128, 199, 1)",
    "rgba(43, 80, 142, 1)",
    "rgba(254, 126, 0, 1)",
  ],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

const genderPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["Laki-laki", "Perempuan"],
  colors: ["rgba(43, 80, 142, 1)", "rgba(254, 126, 0, 1)"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const resUser = await $fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resUser.status === "success") {
      userRole.value = resUser.user.role;
      userName.value = resUser.user.nama || resUser.user.username;
    }

    if (userRole.value === "Manager HRD") {
      const resDashboard = await $fetch("/api/dashboard/manager");
      if (resDashboard.status === "success") {
        dashboardData.value = resDashboard.data;

        statusPegawaiSeries.value = [
          resDashboard.data.charts.kontrakVsTetapVsMagang.kontrak || 0,
          resDashboard.data.charts.kontrakVsTetapVsMagang.tetap || 0,
          resDashboard.data.charts.kontrakVsTetapVsMagang.magang || 0,
        ];

        const dataGender = resDashboard.data.charts.gender || [];

        const lakiLaki = dataGender.find(
          (g) => g.jenis_kelamin.toLowerCase() === "laki-laki",
        );
        const totalLaki = lakiLaki ? lakiLaki.total : 0;

        const perempuan = dataGender.find(
          (g) => g.jenis_kelamin.toLowerCase() === "perempuan",
        );
        const totalPerempuan = perempuan ? perempuan.total : 0;

        genderPegawaiSeries.value = [totalLaki, totalPerempuan];
      }
    }
  } catch (err) {
    console.error("Gagal memuat dashboard:", err);
  }
});
</script>

<template>
  <div class="row g-3">
    <div v-if="userRole !== 'Manager HRD'" class="col-12">
      <div class="card bg-dark text-white">
        <div class="card-body py-5 text-center">
          <h2 class="fw-bold mb-2">
            Selamat Datang {{ userName }} - {{ userRole }}
          </h2>
          <p class="text-white-50 fst-italic">
            "Fokuskan tujuan yang ingin didapat, jangan biarkan faktor lain
            menghalangi tujuan Anda"
          </p>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="col-md-3">
        <div class="card bg-dark h-100 position-relative">
          <div class="card-body">
            <div class="text-center">
              <img
                src="@/assets/images/greeting-img.svg"
                alt=""
                class="img-fluid mb-4"
              />
            </div>
            <h3 class="card-title text-white">
              Halo, selamat datang {{ userName }} - {{ userRole }} di Aplikasi
              Kepegawaian
            </h3>
            <p class="text-white fw-lighter fst-italic">
              "Fokuskan tujuan yang ingin didapat, jangan biarkan faktor lain
              menghalangi tujuan Anda"
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row g-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6 col-lg-3">
                    <div class="text-secondary">Total Pegawai</div>
                    <div class="h3 font-weight-bold">
                      {{ dashboardData?.widgets?.totalPegawai || 0 }}
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-3">
                    <div class="text-secondary">Pegawai Kontrak</div>
                    <div class="h3 font-weight-bold">
                      {{ dashboardData?.widgets?.totalKontrak || 0 }}
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-3">
                    <div class="text-secondary">Pegawai Tetap</div>
                    <div class="h3 font-weight-bold">
                      {{ dashboardData?.widgets?.totalTetap || 0 }}
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-3">
                    <div class="text-secondary">Peserta Magang</div>
                    <div class="h3 font-weight-bold">
                      {{ dashboardData?.widgets?.totalMagang || 0 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">
                  Total Pegawai Berdasarkan Status Kontrak
                </h3>
                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="200"
                    :options="statusPegawaiOptions"
                    :series="statusPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">Total Pegawai Berdasarkan Gender</h3>
                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="200"
                    :options="genderPegawaiOptions"
                    :series="genderPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Pegawai Terbaru</h3>
          </div>
          <div class="table-responsive card-body p-0">
            <table class="table table-vcenter table-striped card-table">
              <thead>
                <tr>
                  <th class="w-1">No</th>
                  <th>NIP</th>
                  <th>Nama Lengkap</th>
                  <th>Tanggal Masuk</th>
                  <th>Status Kepegawaian</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in dashboardData?.latestPegawai"
                  :key="item.id"
                >
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>{{ item.nip }}</td>
                  <td>{{ item.nama_pegawai }}</td>
                  <td>{{ item.tanggal_masuk }}</td>
                  <td>{{ item.jenis_kontrak }}</td>
                  <td>
                    <NuxtLink
                      :to="`/pegawai/${item.id}`"
                      class="btn btn-primary btn-sm"
                    >
                      Detail Pegawai
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
