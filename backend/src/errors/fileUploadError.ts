export class FileUploadError extends Error {
  public field: string;
  constructor(args: { field: string; error: string }) {
    super("Error uploading file.");
    this.name = "FileUploadError";
    this.field = args.field;
  }
}
