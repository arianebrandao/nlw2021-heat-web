import { FaCircleNotch } from "react-icons/fa";

import styles from './styles.module.scss'

export function Loading() {
    return (
        <div className={styles.container}>
            <FaCircleNotch className={styles.animateSpin} />
            <span>Carregando...</span>
        </div>
    )
}