export interface IUser {
    id?: number;
    nome: string;
    email: string;
    senha: string;
  }
  
  export interface IUserLogin {
    nome: string;
    email: string;
    senha: string;
  }
  
  export interface ITokenPayload {
    id: number;
  }
  