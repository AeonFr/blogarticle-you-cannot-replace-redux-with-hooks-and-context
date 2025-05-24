import "../styles/globals.css";
import * as styles from "./styles.css";

export default function Layout({ children }: any) {
  if (children)
    return (
      <div className={styles.wrapper}>
        <main>
          <div className={styles.layoutRoot + " " + styles.documentFlow}>
            {children}
          </div>
        </main>
      </div>
    );
  return null;
}
