import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';


import StackNavigator from "./src/StackNavigator";
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/routes/authStack';
import { AuthProvider } from './src/useAuth';
import useAuth from "./src/useAuth";

const App = () => {


  return(
    //wrap-nahme StackNavigatora sus AuthProvider za da moje vseki komponent v nego da polza user promenlivata
   <NavigationContainer>
    <AuthProvider>
          <StackNavigator   />
    </AuthProvider>
   </NavigationContainer>
  
  

  );
};

export default App;