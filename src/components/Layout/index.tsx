import type { ReactNode } from 'react';
import BottomNav from '../BottomNav';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const Layout = ({ children, showBottomNav = true }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        {children}
      </main>
       <BottomNav />
    </div>
  );
};

export default Layout;