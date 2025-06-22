import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
import { useDbContent } from './DBContentContext';
export type UserRole = 'superuser' | 'admin' | 'content creator' | null;

interface AuthContextType {
   loggedIn: boolean | null;
   user: User | null;
   role: UserRole;
   signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within AuthProvider');
   return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
   const { websiteID } = useDbContent();
   const [user, setUser] = useState<User | null>(null);
   const [role, setRole] = useState<UserRole>(null);
   const signOutUser = () => {
      signOut(auth);
   };
   useEffect(() => {
      console.log('websiteID in useEffect:', websiteID);
      if (!websiteID) return;
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         if (firebaseUser) {
            setLoggedIn(true);
            setUser(firebaseUser);
            console.log('Firebase user:', firebaseUser);
            console.log('Website ID:', websiteID);
            try {
               const data = await readAndWriteToFirebase({
                  method: 'get',
                  ref: `admins/${websiteID}/${firebaseUser.uid}/`,
               });

               if (data && data.role) {
                  setRole(data.role);
               } else {
                  setRole(null);
               }
            } catch (error) {
               console.error('Failed to fetch user role:', error);
               setRole(null);
            }
         } else {
            setLoggedIn(false);
            setUser(null);
            setRole(null);
         }
      });

      return () => unsubscribe();
   }, [websiteID]);

   return <AuthContext.Provider value={{ loggedIn, user, role, signOutUser }}>{children}</AuthContext.Provider>;
};
