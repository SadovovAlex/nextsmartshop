"use client";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;