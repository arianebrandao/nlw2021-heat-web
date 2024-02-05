import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./App.module.scss";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexts/auth";

import logoImage from './assets/logo.svg'

export function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Toaster />
      <main
        className={`${styles.contentWrapper} ${
          user ? styles.contentSigned : ""
        }`}
      >
        <img src={logoImage} alt="DoWhile 2021" className={styles.logotipo} />
        <MessageList />
        {user ? <SendMessageForm /> : <LoginBox />}
      </main>
    </>
  );
}
