import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { api } from '../../services/api'

import styles from './styles.module.scss'
import { Loading } from '../Loading'

interface Message {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messagesQueue: Message[] = []

const socket = io('https://nlw-heat.onrender.com/')

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages ] = useState<Message[]>([])
  const [isLoadingLast3Messages, setIsLoadingLast3Messages] = useState<boolean>(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))//remove valores 'false'

        messagesQueue.shift() //remove valor mais antigo do array
      }
    }, 3000) //3 segundos

    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    setIsLoadingLast3Messages(true)
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
      setIsLoadingLast3Messages(false)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <ul className={styles.messageList}>
        {isLoadingLast3Messages ? <Loading /> : (
          messages.map(message => (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}