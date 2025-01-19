export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
    token?: string;
}

// Interface séparée pour l'inscription
export interface SignupData {
    username: string;
    email: string;
    password: string;
}
  
  