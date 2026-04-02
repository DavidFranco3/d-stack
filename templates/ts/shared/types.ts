export interface ApiResponse {
  status: string;
  message: string;
  data?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
