// Contexto é usado para criar algo que vai ser usado em vários lugares.

import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Processo de autenticação
const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    // Busco do localStorage o meu token e o meu user
    // Essa parte da função só vai ser executada quando o usuario der um refresh na pagina, ou sair e voltar //
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    // Se caso eles existirem eu retorno eles
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    // Caso não exista um dos dois, retorno vazio
    return {} as AuthState;
  });

  // Função para fazer o login //
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // Salvando o token no localStorage //
    // Pego o token e o user da minha chamada ao backend
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    // Fim localStorage //

    // Assim que é feito o login, eu alimento meu Data com o token e o user
    setData({ token, user });
  }, []);

  // Função para fazer logOut //
  const signOut = useCallback(() => {
    // removo os dados de login do localStorage
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:token');

    // Removo os dados de login do usuario
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Função Hook do meu contexto de authentication //
function useAuth(): AuthContextData {
  // crio uma varivel do tipo contexto
  const context = useContext(AuthContext);

  // Se o contexto não for criado eu retorno erro, se foi criado eu retorno ele.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
