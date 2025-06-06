import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';

interface AuthContextType {
   loggedIn: boolean | null;
   user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
         if (firebaseUser) {
            setLoggedIn(true);
            setUser(firebaseUser);
         } else {
            setLoggedIn(false);
            setUser(null);
         }
      });
      return () => unsubscribe();
   }, []);

   return <AuthContext.Provider value={{ loggedIn, user }}>{children}</AuthContext.Provider>;
};
