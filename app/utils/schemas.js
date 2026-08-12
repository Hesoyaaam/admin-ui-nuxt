import { z } from "zod";

export const pegawaiSchema = z.object({
  nip: z
    .string()
    .trim()
    .min(8, "NIP minimal 8 karakter")
    .regex(/^\d+$/, "NIP hanya boleh berisi angka dan tidak boleh ada spasi"),

  nama_pegawai: z
    .string()
    .trim()
    .min(3, "Nama Pegawai minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9' ]+$/,
      "Nama pegawai hanya boleh huruf, angka, tanda petik atas, dan spasi",
    ),

  email: z.string().trim().email("Format email tidak valid"),

  nomor_hp: z
    .string()
    .trim()
    .regex(
      /^\+\d{10,15}$/,
      "Format nomor HP harus menggunakan format internasional (contoh: +6282218458888)",
    )
    .optional()
    .nullable(),

  tempat_lahir: z.string().trim().optional().nullable(),
  tanggal_lahir: z.string().optional().nullable(),
  id_kecamatan: z.number().int().optional().nullable(),

  alamat_kabupaten: z.string().trim().optional().nullable(),
  alamat_provinsi: z.string().trim().optional().nullable(),

  alamat_lengkap: z.string().trim().optional().nullable(),

  jarak_rumah_kantor: z
    .number()
    .int("Jarak harus berupa angka")
    .min(0, "Jarak tidak boleh minus")
    .max(99, "Jarak maksimal 2 digit")
    .optional()
    .nullable(),

  status_kawin: z.enum(["kawin", "tidak kawin"]).optional().nullable(),

  jumlah_anak: z
    .number()
    .int("Jumlah anak harus angka")
    .min(0)
    .max(99, "Jumlah anak maksimal 2 digit")
    .optional()
    .nullable(),

  tanggal_masuk: z.string().optional().nullable(),

  id_jabatan: z.number().int().optional().nullable(),
  id_departemen: z.number().int().optional().nullable(),

  status: z.enum(["Aktif", "Nonaktif"]).default("Aktif"),

  riwayat_pendidikan: z
    .array(
      z.object({
        tingkat: z.string().trim().min(1, "Tingkat pendidikan wajib diisi"),
        nama_sekolah: z.string().trim().min(1, "Nama sekolah wajib diisi"),
        tahun_lulus: z.number().int().optional().nullable(),
      }),
    )
    .optional()
    .default([]),
});

export const transportSettingSchema = z.object({
  tarif_per_km: z.number().int().positive("Tarif harus lebih dari 0"),
  berlaku_mulai: z.string().min(10, "Tanggal berlaku wajib diisi"),
  min_km: z.number().int().nonnegative().default(0),
  max_km: z.number().int().nonnegative().default(0),
});

export const userSchema = z.object({
  nama: z.string().trim().min(1, "Nama pegawai wajib dipilih"),
  id_pegawai: z.number().int().positive("ID Pegawai valid diperlukan"),
  username: z
    .string()
    .trim()
    .min(6, "Username minimal 6 karakter")
    .regex(
      /^[a-z0-9]+$/,
      "Username hanya boleh huruf kecil dan angka, serta tanpa spasi",
    ),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/^\S*$/, "Password tidak boleh mengandung spasi")
    .regex(/(?=.*[a-z])/, "Password harus memiliki minimal 1 huruf kecil")
    .regex(/(?=.*[A-Z])/, "Password harus memiliki minimal 1 huruf besar")
    .regex(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password harus memiliki minimal 1 karakter khusus",
    ),

  id_jabatan: z.coerce.number().int().positive("Jabatan wajib dipilih"),
  id_departemen: z.coerce.number().int().positive("Departemen wajib dipilih"),
  id_role: z.coerce.number().int().positive("Role wajib dipilih"),

  is_aktif: z.boolean().default(true),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username/Email/No. HP tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});
