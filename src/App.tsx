import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./App.module.scss";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexts/auth";

export function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Toaster />
      <main
        className={`${styles.contentWrapper} ${
          !!user ? styles.contentSigned : ""
        }`}
      >
        <MessageList />
        {!!user ? <SendMessageForm /> : <LoginBox />}
      </main>
    </>
  );
}
