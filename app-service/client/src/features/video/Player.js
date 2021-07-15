import ReactPlayer from 'react-player'
import styles from './Video.module.css'; 

export const Player = ({ url }) => {
    return (
        <div className={styles.playerWrapper}><ReactPlayer className={styles.reactPlayer} url={url} controls={true} 
             /></div>
    )
}