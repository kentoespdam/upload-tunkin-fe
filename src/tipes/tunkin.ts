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
  file: z
    .any()
    .refine(
      (files) => Array.from(files).every((file) => file instanceof File),
      "File wajib diisi",
    )
    .refine(
      (files) =>
        Array.from(files).every(
          (file) =>
            file instanceof File && ACCEPTED_FILE_TYPES.includes(file.type),
        ),
      "Invalid file type",
    )
    .refine(
      (files) =>
        Array.from(files).every(
          (file) => file instanceof File && file.size <= MAX_UPLOAD_SIZE,
        ),
      "Maks File Upload 10 MB",
    ),
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