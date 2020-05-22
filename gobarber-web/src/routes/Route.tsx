import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

// Falo que meu Route vai ter todas as propriedades já existentes, mais o isPrivate
interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        // Verificação de autenticidade //
        // Se a rota é privada e o usuario está logado -> Ele continua no Component que ele está
        return isPrivate === !!user ? (
          <Component />
        ) : (
          // Senão, e a rota for privada eu mando ele pro login, ou se ele ta logado e a rota nao é privada eu mando ele pro dashboard
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
