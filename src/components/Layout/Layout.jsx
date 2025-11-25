import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Footer, Navbar } from "..";

export default function Layout({ children }) {
  const { asPath } = useRouter();
  const isPresent = useIsPresent();

  return (
    <AnimatePresence initial={false} mode="wait">
      {/* Added Transition and theme */}
      <Fragment key={asPath}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          {/* Transition Screen */}
          
        </ThemeProvider>
      </Fragment>
    </AnimatePresence>
  );
}
