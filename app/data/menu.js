import {
  IconLayoutDashboardFilled,
  IconUserFilled,
  IconDatabaseFilled,
  IconUsers,
  IconHistory,
} from "@tabler/icons-vue";

export const menuItems = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboardFilled,
    to: "/",
    roles: ["Superadmin", "Manager HRD", "Admin HRD"],
  },
  {
    title: "Data Pegawai",
    icon: IconUserFilled,
    to: "/pegawai",
    roles: ["Manager HRD", "Admin HRD"],
  },
  {
    title: "Tunjangan",
    icon: IconDatabaseFilled,
    roles: ["Manager HRD", "Admin HRD"],
    children: [
      {
        title: "Setting Tunjangan Transport",
        to: "/tunjangan/setting",
        roles: ["Admin HRD"],
      },
      {
        title: "Tunjangan Transport",
        to: "/tunjangan/transport",
        roles: ["Manager HRD", "Admin HRD"],
      },
    ],
  },
  {
    title: "Manajemen User",
    icon: IconUsers,
    roles: ["Superadmin"],
    children: [
      {
        title: "Manajemen Role",
        to: "/user/role",
        roles: ["Superadmin"],
      },
      {
        title: "Manajemen User",
        to: "/user/manage",
        roles: ["Superadmin"],
      },
    ],
  },
  {
    title: "Log Aktifitas",
    icon: IconHistory,
    to: "/log",
    roles: ["Superadmin"],
  },
];
