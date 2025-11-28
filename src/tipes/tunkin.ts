import z from "zod";
import type { ColumnDef } from "./commons";

export type Tunkin = {
  id: string;
  periode: string;
  nipam: string;
  nama: string;
  jabatan: string;
  organisasi: string;
  status_pegawai: string;
  nominal: number;
};

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const UploadTunkinSchema = z.object({
  tahun: z.string().min(4, "Periode wajib diisi"),
  bulan: z.string().min(2, "Periode wajib diisi"),
  file: z
    .union([
      z
        .instanceof(File, { message: "File wajib diisi" })
        .refine((file) => file.size <= MAX_UPLOAD_SIZE, "Max File Upload 10 MB")
        .refine(
          (file) => ACCEPTED_FILE_TYPES.includes(file.type),
          "Invalid file type",
        ),
      z.string(),
    ])
    .refine((value) => value instanceof File || typeof value === "string", {
      message: "File wajib diisi",
    }),
});

export type UploadTunkinSchema = z.infer<typeof UploadTunkinSchema>;

export const tunkinTableHeders: ColumnDef[] = [
  { id: "", title: "No", width: 30, align: "right" },
  { id: "periode", title: "Periode" },
  { id: "nipam", title: "NIPAM" },
  { id: "nama", title: "Nama" },
  { id: "jabatan", title: "Jabatan" },
  { id: "organisasi", title: "Organisasi" },
  { id: "status_pegawai", title: "Status Pegawai" },
  { id: "nominal", title: "Nominal" },
];