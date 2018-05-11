export type ProfileState = {
  filesOnUpload: Array<FileCloud>;
  uploadProgress: number;
  handleSubmitting: boolean;
};

export type FileCloud = {
  bytes: number;
  created_at: Date;
  etag: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: Array<string>;
  type: string;
  url: string;
  version: number;
  width: number;
}

export type ProfileDispatch =
  | { type: 'user/upload/file', payload: FileCloud }
  | { type: 'user/upload/clear' }
  | { type: 'user/upload/progress', payload: number }
  | { type: 'user/upload/submitting', payload: boolean }
;
