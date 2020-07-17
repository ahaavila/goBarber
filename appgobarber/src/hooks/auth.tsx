// Contexto é usado para criar algo que vai ser usado em vários lugares.

import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Processo de autenticação
const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  // Função que vai carregar os dados do token
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      // Busco do AsyncStorage o meu token e o meu user
      // Essa parte da função só vai ser executada quando o usuario der um refresh na pagina, ou sair e voltar //
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      // Quando eu estou com os dados eu seto o loading como false
      setLoading(false);
    }

    loadStorageData();
  }, []);

  // Função para fazer o login //
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // Salvando o token no AsyncStorage //
    // Pego o token e o user da minha chamada ao backend
    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    // Fim AsyncStorage //

    // Assim que é feito o login, eu alimento meu Data com o token e o user
    setData({ token, user });
  }, []);

  // Função para fazer logOut //
  const signOut = useCallback(async () => {
    // removo os dados de login do AsyncStorage
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:token']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
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
