import styles from "styles/Home/About.module.css";
import { Logo } from "../Logo/Logo";
import { Logo2 } from "../Logo/Logo2";
import ScrambledText from '../Elements/ScrambleText';
import { AnimatedWelcomeText } from "../ui/text-generate-effect";

const About = () => {
  return (
    <section id="About">
      <ScrambledText
        className="section-title"
        radius={100}
        duration={1.2}
        speed={0.5}
        scrambleChars=".:"
      >
       About Us
      </ScrambledText>
      
      <div className={`${styles.container} select-none`}>
        <div className={styles.title}>
          <Logo /> <Logo2 />
        </div>

        <AnimatedWelcomeText duration={1} />
      </div>
    </section>
  );
};

export default About;
