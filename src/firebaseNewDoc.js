import { app } from "../firebase";
import { getFirestore, doc, updateDoc, collection, getDoc, addDoc} from 'firebase/firestore';

const db = getFirestore(app);
const dbUsersUIDcollection = collection(db, "usersUID");
const dbMealsCollection = collection(db, "meals");
const dbInfoCollection = collection(db, "dbInfo");




export async function NewStudent () {
    
// const docRef = await addDoc(dbUsersUIDcollection, {

//         CheckIndicatorBoolean       :       false,
//         EatTimesLastMonth           :       0,
//         EatTimesThisMonth           :       0,
//         EatTrueFalse                :       false,
//         fullName                    :       "gosho B",
//         class                       :       3,
//         numberInClass               :       7,
//         role                        :       "student"

//     });
//   console.log("Document written with ID: ", docRef.id);

}

export async function NewTeacher () {
    
    // const docRef = await addDoc(dbUsersUIDcollection, {
    
    //     CheckIndicatorBoolean       :       false,
    //     EatTimesLastMonth           :       0,
    //     EatTimesThisMonth           :       0,
    //     EatTrueFalse                :       false,
    //     fullName                    :       "gosho pedri",
    //     role                        :       "teaher"

    // });
    //   console.log("Document written with ID: ", docRef.id);
    
    }