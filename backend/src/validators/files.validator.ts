import { z } from "zod";

const fileIdSchema = z.string().trim().min(1);

const baseSchema = z.object({
  fileIds: z
    .array(z.string().length(24, "Invaild file ID "))
    .min(1, "At least one file ID must be provided"),
});

const deleteFilesSchema = baseSchema;
const downloadFilesSchema = baseSchema;

type DeleteFilesSchemaType = z.infer<typeof deleteFilesSchema>;
type DownloadFilesSchemaType = z.infer<typeof downloadFilesSchema>;

export {
  baseSchema,
  deleteFilesSchema,
  DeleteFilesSchemaType,
  downloadFilesSchema,
  DownloadFilesSchemaType,
  fileIdSchema,
};
