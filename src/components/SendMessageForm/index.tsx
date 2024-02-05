import { useContext, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    } else {
      try {
        setSendingMessage(true);

        await api.post("messages", { message });

        setMessage(""); // limpa form
        toast.success("Mensagem enviada com sucesso!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        setSendingMessage(false);
      } catch (err) {
        toast.error("Oops... algo deu errado. Por favor, tente novamente.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        console.log(err);
      }
    }
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <div className={styles.formWrapper}>
        <button onClick={signOut} className={styles.signOutButton}>
          <VscSignOut size="32" />
        </button>

        <header className={styles.userInformation}>
          <div className={styles.userImage}>
            <img src={user?.avatar_url} alt={user?.name} />
          </div>

          <strong className={styles.userName}>{user?.name}</strong>
          <span className={styles.userGithub}>
            <VscGithubInverted size="16" />
            {user?.login}
          </span>
        </header>

        <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
          <label htmlFor="message">Mensagem</label>
          <textarea
            name="message"
            id="message"
            placeholder="Qual sua expectativa para o evento?"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
            maxLength={140}
          />

          {!sendingMessage ? (
            <button type="submit">Enviar mensagem</button>
          ) : (
            <button type="button" disabled>
              Enviando mensagem
            </button>
          )}
        </form>
      </div>
    </div>

  );
}
