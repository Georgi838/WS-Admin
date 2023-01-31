import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../custom/colors";
import { NewStudent, NewTeacher } from "../firebaseNewDoc";
import Header from "../custom/header";
import { SelectList } from "react-native-dropdown-select-list";

const auth = getAuth(app);
const db = getFirestore(app);
const dbUsersUIDcollection = collection(db, "usersUID");
const dbMealsCollection = collection(db, "meals");
const dbInfoCollection = collection(db, "dbInfo");

const MainPage = () => {
  const [_userUID, set_userUID] = useState();
  const [_TIME, set_TIME] = useState();
  const [priceForOneMeal, setPriceForOneMeal] = useState();
  const [priceDue, setPriceDue] = useState();
  const [teacherClass, setTeacherClass] = useState();
  const [userInfoFromDB, setUserInfoFromDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const LoadingScrean = () => {
    return (
      <View style={styles.ActivityIndicatorStyle}>
    <ActivityIndicator  size={60} color={Colors.textColor} />
    </View>
      )
  };

  useEffect(() => {
    getUser();
    getDayToday();
    getStudentsInfo();
  }, []);

  const getUser = async () => {
    await onAuthStateChanged(auth, (user) => {
      set_userUID(user.uid);

      const docRef = doc(dbUsersUIDcollection, user.uid);
      getDoc(docRef)
        .then((res) => {
          setTeacherClass(res.data().classTeaching);
          console.log(classTeaching);
        })
        .catch((err) => console.log(err));

      getPrice(user.uid);
    });
  };

  const getDayToday = async () => {
    const docRef = doc(dbInfoCollection, "time");
    await getDoc(docRef)
      .then((res) => {
        set_TIME(
          res
            .data()
            .dayToday.toDate()
            .getDay()
        );
      })
      .catch((err) => console.log(err));
  };

  const getPrice = (userUID) => {
    console.log(userUID);
    const docRefUser = doc(dbUsersUIDcollection, userUID);
    let docRefPrice;

    _TIME >= 1 && _TIME < 6
      ? (docRefPrice = doc(dbMealsCollection, `${_TIME}`))
      : (docRefPrice = doc(dbMealsCollection, "1"));

    getDoc(docRefUser)
      .then((res) => {
        setPriceDue(res.data().PriceDueThisMont);
      })
      .catch((err) => console.log(err));

    getDoc(docRefPrice)
      .then((res) => {
        setPriceForOneMeal(res.data().price);
      })
      .catch((err) => console.log(err));
  };

  const getStudentsInfo = () => {
    getDocs(dbUsersUIDcollection).then((docsSnap) => {
      setUserInfoFromDB([]);
      docsSnap.forEach((doc) => {
        if (doc.data().role == "student") {
          let updatedValue = doc.data();
          updatedValue.docID = doc.id;
          setUserInfoFromDB((userInfoFromDB) => [
            ...userInfoFromDB,
            updatedValue,
          ]);
        }
      });
      setIsLoading(false);
    });
  };

  const pressYES = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (!res.data().EatTrueFalse) {
            setIsLoading(true);
            updateDoc(docRef, {
              EatTrueFalse: true,
              EatTimesThisMonth: res.data().EatTimesThisMonth + 1,
              PriceDueThisMont: res.data().PriceDueThisMont + priceForOneMeal,
            })
              .then(() => {
                setIsLoading(false);

                getStudentsInfo();
                forceUpdate();
              })
              .catch((err) => console.log(err));

            if (!res.data().CheckIndicatorBoolean) {
              updateDoc(docRef, {
                CheckIndicatorBoolean: true,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const pressNO = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (res.data().EatTrueFalse) {
            setIsLoading(true);
            updateDoc(docRef, {
              EatTrueFalse: false,
              EatTimesThisMonth: res.data().EatTimesThisMonth - 1,
              PriceDueThisMont: res.data().PriceDueThisMont - priceForOneMeal,
            })
              .then(() => {
                setIsLoading(false);
                getStudentsInfo();
                forceUpdate();
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  function EatOrNotForDisplayUsers(prop) {
    if (prop.boolean) {
      return <Text style={styles.EatOrNotForDisplayUsersYes}>Записан/а</Text>;
    } else {
      return (
        <Text style={styles.EatOrNotForDisplayUsersNo}>Не е записан/а</Text>
      );
    }
  }

  function DisplayUsers() {
    userInfoFromDB.sort((a, b) => a.numberInClass - b.numberInClass);

    return (
      <>
        <Header />
        <View style={styles.displayUsersView}>
          <Text style={styles.classText}>Ученици от клас {teacherClass}</Text>

          <ScrollView
            style={styles.listScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* <LinearGradient colors={[Colors.backgroundFirstColor,Colors.backgroundSecondColor]} style={styles.displayUsersBackgroundLinear}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          > */}
            <View style={styles.paddingView}>
              {userInfoFromDB.map((item) => {
                if (item.class == teacherClass) {
                  return (
                    <View style={styles.listMainView} key={item.numberInClass}>
                      <LinearGradient
                        colors={[
                          Colors.secondaryBackgroundFirstColor,
                          Colors.secondaryBackgroundSecondColor,
                        ]}
                        style={styles.displayUsersRowBackgroundLinear}
                        start={{ x: 0.2, y: 1 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <LinearGradient
                          colors={[
                            Colors.titleViewsFirstColor,
                            Colors.titleViewsSecondColor,
                          ]}
                          style={styles.rowNameLinear}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                        >
                          <View style={styles.listText}>
                            <Text style={styles.listItemNumberInClass}>
                              №{item.numberInClass}:
                            </Text>
                            <Text style={styles.listItemFullName}>
                              {item.fullName}
                            </Text>
                          </View>
                        </LinearGradient>

                        {item.PricePaid ? (
                          <>
                            <View style={styles.displayFlex}>
                              <View style={styles.listPressable}>
                                <View style={styles.btnQuestionTextViewColumn}>
                                  <Text style={styles.miniTitles}>
                                    Ще яде ли?
                                  </Text>
                                  <View style={styles.btnQuestionTextViewRow}>
                                    <LinearGradient
                                      colors={[
                                        Colors.buttonsFirstColor,
                                        Colors.buttonsSecondColor,
                                      ]}
                                      style={styles.eatBtnsLinear}
                                      start={{ x: 0, y: 1 }}
                                      end={{ x: 1, y: 1 }}
                                    >
                                      <Pressable onPress={pressYES(item)}>
                                        <Text
                                          style={
                                            item.EatTrueFalse
                                              ? styles.YES
                                              : styles.YN
                                          }
                                        >
                                          Да
                                        </Text>
                                      </Pressable>
                                    </LinearGradient>
                                    <LinearGradient
                                      colors={[
                                        Colors.buttonsFirstColor,
                                        Colors.buttonsSecondColor,
                                      ]}
                                      style={styles.eatBtnsLinear}
                                      start={{ x: 0, y: 1 }}
                                      end={{ x: 1, y: 1 }}
                                    >
                                      <Pressable onPress={pressNO(item)}>
                                        <Text
                                          style={
                                            !item.EatTrueFalse
                                              ? styles.NO
                                              : styles.YN
                                          }
                                        >
                                          Не
                                        </Text>
                                      </Pressable>
                                    </LinearGradient>
                                  </View>
                                </View>
                              </View>
                              <View style={styles.studentStatus}>
                                <Text style={styles.miniTitles}>
                                  Статус на ученика:
                                </Text>
                                <EatOrNotForDisplayUsers
                                  boolean={item.EatTrueFalse}
                                />
                                <Text style={styles.miniTitlesPay}>
                                  Дължи:{" "}
                                  {(1 * item.PriceDueThisMont).toFixed(2)}лв.
                                </Text>
                              </View>
                            </View>
                          </>
                        ) : (
                          <Text style={styles.miniTitle}>
                            Дължи: {(1 * item.PriceMustPay).toFixed(2)}лв.
                          </Text>
                        )}
                      </LinearGradient>
                    </View>
                  );
                }
              })}
            </View>
            {/* </LinearGradient> */}
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.loadingView}>
        {isLoading ? LoadingScrean() : null}
      </View>
      <LinearGradient
        colors={[Colors.backgroundFirstColor, Colors.backgroundSecondColor]}
        style={styles.listPageBackgroundLinear}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <DisplayUsers />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  
  //main
  mainView: {
    backgroundColor: Colors.lightBlue,
    flex: 1,
  },
  loadingView: {
    position: "absolute",
    top: 0,
    zIndex: 3, // works on ios
    elevation: 3, // works on android
    height: 40,
    width: "100%",
  },
  displayUsersView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  listScrollView: {
    height: "100%",
    width: "95%",
    borderRadius: 16,
    maxHeight: 540,
    // marginLeft: 8,
    borderBottomLeftRadius: 16,
    paddingTop: 11.2,
  },
  listMainView: {
    flexDirection: "column",
    justifyContent: "center",
    alighItems: "center",
    borderRadius: 16,
    height: 140,
    marginBottom: 36,
  },


  // linear


  rowNameLinear: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 6,
  },

  eatBtnsLinear: {
    borderRadius: 16,
    marginHorizontal: 6,
    paddingHorizontal: 6,
    shadowColor: Colors.textColor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.21,
    shadowRadius: 5.65,
    elevation: 6,
  },
  displayUsersBackgroundLinear: {
    borderRadius: 16,
    paddingVertical: 12,
  },
  displayUsersRowBackgroundLinear: {
    borderRadius: 16,
    width: 350,
    height: 160,
    shadowColor: Colors.textColor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.21,
    shadowRadius: 5.65,
    elevation: 6,
  },


  //other views


  studentStatus: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 6,
    paddingRight: 2,
    paddingBottom: 4,
  },
  btnQuestionTextViewColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btnQuestionTextViewRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  paddingView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingBottom: 4,
  },
  displayFlex: {
    width: "92%",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  //content

  
  classText: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10,
    padding: 6,
  },
  listText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  miniTitles: {
    textAlign: "center",
    fontSize: 16,
    padding: 4,
    fontWeight: "bold",
  },
  miniTitlesPay: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 4,
  },
  miniTitle: {
    textAlign: "center",
    fontSize: 16,
    padding: 4,
    fontWeight: "bold",
    paddingTop: 30,
  },
  listItemNumberInClass: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItemFullName: {
    fontSize: 17,
    marginLeft: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  listPressable: {
    flexDirection: "row",
    justifyContent: "center",
  },
  EatOrNotForDisplayUsersYes: {
    fontSize: 16,
    fontWeight: "bold",
    textAlignVertical: "center",
    color: Colors.textColor,
    padding: 4,
  },

  EatOrNotForDisplayUsersNo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlignVertical: "center",
    color: Colors.textColor,
    padding: 4,
  },
  YES: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 8,

    paddingRight: 8,
    paddingLeft: 8,
    margin: 6,
  },
  NO: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 8,
    paddingRight: 8,
    paddingLeft: 9,
    margin: 6,
  },
  YN: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 8,
    paddingRight: 8,
    paddingLeft: 8,
    margin: 6,
  },
  
  ActivityIndicatorStyle: {
   
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    height:820,
    zIndex:100,
  },
});

export default MainPage;
