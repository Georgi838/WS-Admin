// import { View, Text } from 'react-native'
// import React from 'react'

// const menu = ({_TIMEprop}) => {
//   return (
//     <View>
//           <Text style={styles.mealMainText}>
//             {_TIMEprop + 1 > 1 && _TIMEprop + 1 < 7
//               ? "Менюто утре e:"
//               : "Менюто за понеделник:"}
//           </Text>
//         <LinearGradient
//           colors={[
//             Colors.secondaryBackgroundFirstColor,
//             Colors.secondaryBackgroundSecondColor,
//           ]}
//           style={styles.menuLinear}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 0, y: 1 }}
//         >
//           <View style={styles.mealsTodayViewPadding}>
//             <View>
//               <Text style={styles.mealText}>1 - {firstMealToday}</Text>
//             </View>
//             <View>
//               <Text style={styles.mealText}>2 - {secondMealToday}</Text>
//             </View>
//             <View>
//               <Text style={styles.mealText}>3 - {thirdMealToday}</Text>
//             </View>
//           </View>
//         </LinearGradient>
//       </View>
//   )
// }

// export default menu