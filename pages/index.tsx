import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {Button} from 'antd'
import Login from './login'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      This is HomePage
    </div>
  )
}

export default Home
