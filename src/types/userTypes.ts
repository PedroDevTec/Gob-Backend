export interface IUser {
  id?: string;  // ✅ Agora 'id' está definido corretamente como string

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
    id: string;
  }
  