import styles from "styles/Home/Home.module.css";
import { Logo2 } from "../Logo/Logo2";
import FuzzyText from '../Elements/FuzzyText';
  


const Home = () => {
  return (
    <section className={styles.home} >
      <Logo2 />
      <FuzzyText 
  baseIntensity={0.1} 
  hoverIntensity={0.2} 
  enableHover={true}
>
 SRMIST NCR CHAPTER
</FuzzyText>
      <h2>A Community of SRMIST Students</h2>
    </section>
  );
};

export default Home;
