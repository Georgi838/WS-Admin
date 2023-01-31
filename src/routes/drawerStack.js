// import { createDrawerNavigator } from 'react-navigation-drawer';
// import MainPage from "../screens/mainPage";
// import ListPage from "../screens/listPage";
// import Header from "../custom/headerAuth";
// import React from "react";
// import Colors from '../custom/colors';

// const screens = {

//     MainPage: {
//         screen: MainPage,
//         navigationOptions: {
//             navigationOptions: ({ navigation }) => {
//                 return{
//                     headerTitle: () => <Header navigation={navigation} />,
//                 }
//             }
//         }
//     },
//     ListPage:{
//         screen: ListPage,
//         navigationOptions: {
//             navigationOptions: ({ navigation }) => {
//                 return{
//                     headerTitle: () => <Header navigation={navigation} />,
//                 }
//             }
//         }
//     }


// }

// const DrawerStack = createDrawerNavigator(screens,{
//     defaultNavigationOptions: {
//     headerStyle:{backgroundColor: Colors.mainBlue, height:100}
// }
// });

// export default DrawerStack;