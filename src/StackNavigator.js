import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  TabActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthPage from "./screens/AuthPage";
import ListPage from "./screens/ListPage";
import MainPage from "./screens/MainPage";
import useAuth from "./useAuth";
import { app } from "../firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationEvents } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "./custom/colors";


const Tab = createBottomTabNavigator();
//tab za dolnoto menu, stack za normalna navigaciq
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const { user } = useAuth();

  return (
    //ako imash dve otdelni neshta v returna shte ti pokaje greshka no prazniqt tag ni spasqva jivota
    <>
      {user ? (
        //pokaji content-a ako ima user inace pokaji authPage-a
        <>
          {user.email === "dimitar.paraleev_98@abv.bg" ? (
        //task: napravi da renderva content-a ako rolqta e ucitel

            <Tab.Navigator
            //pri logvane te prashta v MainPage vinagi
              initialRouteName="MainPage"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                  //trqbva da e s absolutna poziciq za da se polzva nqkakuv stil
                  postion: "absolute",
                  backgroundColor: Colors.bottomTabNavigator,
                  height: 75,
                },
                //stila na iconite v menuto
                tabBarIcon: ({ focused, size, color, shadow }) => {
                  let iconName;
                  if (route.name === "MainPage") {
                    (iconName = focused ? "home-circle" : "home"),
                      (size = focused ? 42 : 32),
                      (color = focused
                        ? Colors.bottomTabNavigatorIconFocused
                        : Colors.bottomTabNavigatorIcon);
                  }
                  if (route.name === "ListPage") {
                    (iconName = focused
                      ? "clipboard-list"
                      : "clipboard-list-outline"),
                      (size = focused ? 42 : 32),
                      (color = focused
                        ? Colors.bottomTabNavigatorIconFocused
                        : Colors.bottomTabNavigatorIcon);
                  }
                  //returnvame componenta i my pasvame promenlivite
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={size}
                      color={color}
                      style={styles.icon}
                    />
                  );
                },
              })}
            >
              <Tab.Screen
                name="MainPage"
                component={MainPage}
                options={{
                  //nadpisa pod ikonata
                  tabBarLabel: "Начало",
                  tabBarLabelStyle: {
                    paddingBottom: 6,
                    color: Colors.bottomTabNavigatorLabel,
                    fontSize: 12,
                  },
                }}
              />
              <Tab.Screen
                name="ListPage"
                component={ListPage}
                options={{
                  //nadpisa pod ikonata
                  tabBarLabel: "Лист",
                  tabBarLabelStyle: {
                    paddingBottom: 6,
                    color: Colors.bottomTabNavigatorLabel,
                    fontSize: 12,
                  },
                }}
              />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="MainPage"
            >
              <Stack.Screen name="MainPage" component={MainPage} />
            </Stack.Navigator>
          )}
        </>
      ) : (
        //ako nqma user mu pokaji authPage-a
        <>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="AuthPage"
          >
            <Stack.Screen name="AuthPage" component={AuthPage} />
          </Stack.Navigator>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    paddingTop: 9,
  },
});

export default StackNavigator;
