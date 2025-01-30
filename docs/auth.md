# Renderização Condicional Usando Autenticação do usuário

---

Quando estamos carregando nossas interfaces, muitas vezes existem locais que o usuário não deve visualizar e muito menos, saber que existe. Logo existem têcnicas para nos dar suporte para este problema. Iremos Abordar 3 delas, sendo elas: HOC, Hooks e Wrapper.

## 1. **Criar um Componente de Alto Nível (HOC - Higher-Order Component)**

Um HOC é um componente que envolve outro componente e adiciona funcionalidades extras. No seu caso, você pode criar um HOC que verifica a autenticação e, se o usuário não estiver autenticado, redireciona para a tela de login.

### Exemplo de HOC

```typescript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { goToLogin } from '../../routes/coordinates';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user.token) {
        goToLogin(navigate);
      }
    }, [user.token, navigate]);

    // Se não houver token, não renderiza o componente
    if (!user.token) {
      return null;
    }

    // Renderiza o componente passado como parâmetro
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
```

#### Como usar o HOC

Agora, você pode envolver qualquer página que precise de autenticação com o HOC `withAuth`.

```typescript
import * as S from "./styles";
import Header from "../../components/Header";
import Home from "../../components/Home";
import withAuth from '../../hocs/withAuth'; // Importe o HOC

const HomePage = () => {
  return (
    <S.Container>
      <Header />
      <Home />
    </S.Container>
  );
};

// Aplica o HOC para proteger a página
export default withAuth(HomePage);
```

---

### 2. **Criar um Hook Personalizado**

Outra abordagem é criar um hook personalizado que encapsula a lógica de autenticação. Esse hook pode ser reutilizado em qualquer componente que precise verificar a autenticação.

#### Exemplo de Hook

```typescript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { goToLogin } from '../../routes/coordinates';

const useAuth = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.token) {
      goToLogin(navigate);
    }
  }, [user.token, navigate]);

  return !!user.token; // Retorna `true` se o usuário estiver autenticado
};

export default useAuth;
```

#### Como usar o Hook

No seu componente, você pode usar o hook `useAuth` para verificar a autenticação.

```typescript
import * as S from "./styles";
import Header from "../../components/Header";
import Home from "../../components/Home";
import useAuth from '../../hooks/useAuth'; // Importe o hook

const HomePage = () => {
  const isAuthenticated = useAuth();

  // Se não estiver autenticado, não renderiza o componente
  if (!isAuthenticated) {
    return null;
  }

  return (
    <S.Container>
      <Header />
      <Home />
    </S.Container>
  );
};

export default HomePage;
```

---

### 3. **Criar um Wrapper Component (Componente de Envolvimento)**

Se você preferir não usar HOCs ou hooks, pode criar um componente que envolva as páginas e gerencie a autenticação.

#### Exemplo de Wrapper Component

```typescript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { goToLogin } from '../../routes/coordinates';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.token) {
      goToLogin(navigate);
    }
  }, [user.token, navigate]);

  // Se não houver token, não renderiza o conteúdo
  if (!user.token) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
```

#### Como usar o Wrapper Component

Envolva suas páginas com o `AuthWrapper`.

```typescript
import * as S from "./styles";
import Header from "../../components/Header";
import Home from "../../components/Home";
import AuthWrapper from '../../components/AuthWrapper'; // Importe o wrapper

const HomePage = () => {
  return (
    <AuthWrapper>
      <S.Container>
        <Header />
        <Home />
      </S.Container>
    </AuthWrapper>
  );
};

export default HomePage;
```

---

### Qual abordagem escolher?

- **HOC**: Ideal se você quiser uma solução mais "declarativa" e estiver familiarizado com o padrão HOC.
- **Hook**: Mais moderno e flexível, especialmente se você já estiver usando hooks em seu projeto.
- **Wrapper Component**: Simples e direto, sem a complexidade de HOCs ou hooks.

Todas as abordagens são válidas, então escolha a que melhor se adapta ao seu estilo de codificação e ao seu projeto
