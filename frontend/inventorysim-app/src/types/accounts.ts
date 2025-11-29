export interface Account {
  id?: number;
  fullname: string;
  email: string;
  username?: string;
  password: string;
  role: string | 'USER';
  position: string;
  profileImage?: string | null;

}
