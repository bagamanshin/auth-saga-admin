export type ApiResponse<RES, ERR = undefined> = {
  status: 200 | 400 | 401 | 404 | 404 | 422 | 500;
  data: RES | null;
  error?: ERR;
  headers?: Headers;
};
