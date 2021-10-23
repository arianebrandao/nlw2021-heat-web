import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface AuthProvider {
  children: ReactNode;
}

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

interface AuthContextData {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=4f27d86430bf804d46b3&redirect_uri=http://localhost:3000`;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = response.data

    localStorage.setItem('@dowhile2021:token', token)

    // a partir dessa linha, toda requisição do axios vai enviar a token
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user)
  }

  function signOut(){
    setUser(null)
    localStorage.removeItem('@dowhile2021:token')
  }

  // dados do usuario logado disponivel
  useEffect(() => {
    const token = localStorage.getItem('@dowhile2021:token')

    if (token) {
      // a partir dessa linha, toda requisição do axios vai enviar a token
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => setUser(response.data))
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')

      //limpa atributos da url
      window.history.pushState({}, '', urlWithoutCode)
      signIn(githubCode)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}