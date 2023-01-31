// import { createStackNavigator } from "react-navigation-stack";
// import { createAppContainer } from "react-navigation";
// import AuthPage from "../screens/authPage";
// import MainPage from "../screens/mainPage";
// import DrawerStack from "./drawerStack";
// import Header from "../custom/header";
// import HeaderAuth from "../custom/headerAuth";
// import React from "react";
// import Colors from '../custom/colors';
// import { LinearGradient } from "expo-linear-gradient";

// const RootStacks = createStackNavigator({

//     ListPage: {
//         screen: ListPage,
//         navigationOptions: {
//             headerTitle: () =><HeaderAuth />,
//         }
//     },
//     MainPage: {
//         screen: MainPage,
//         navigationOptions: ({ navigation }) => {
//             return {
//                 headerTitle: () =><HeaderAuth navigation={navigation} />,
//             }
//         }
//     },
    


// }
// // ,{
// //     defaultNavigationOptions: {
// //         headerStyle:{<LinearGradient colors={["#88D3EE","#2280de"]} style={styles.linearTwo}
// //         start={{x: 0.1, y: 0}}
// //         end={{x: 1, y: 1}}
// //         ></LinearGradient>}
// //     }
// // }
// );



// export default createAppContainer(RootStacks);