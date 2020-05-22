import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  // State para armazenar as mensagens de erro do toast
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  // Metodo para adicionar um Toast
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      // crio um id pro toast
      const id = uuid();

      // Crio meu toast
      const toast = {
        id,
        type,
        title,
        description,
      };

      // Jogo meu toast para dentro do state.
      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    [],
  );

  // Metodo para remover um Toast
  const removeToast = useCallback((id: string) => {
    // função que me devolve todas as mensagens que eu tenho no state, menos a que eu estou recebendo
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// Função para incializar meu TostContext
function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
