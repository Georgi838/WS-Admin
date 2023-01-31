// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.fromMondayToFriday = functions.pubsub.schedule('1 14 * * 0-4').onRun(async context => {

    let eatTimesForToday;
    let breadPrice;
    let breadPackagesForToday;
    
    await db.doc('dbInfo/price').get().then(async snap => {
        breadPrice = snap.data().breadPrice;
        breadPackagesForToday = snap.data().breadPackagesForToday;

        await db.doc('dbInfo/eatTimesForToday').get().then(snap2 => {
            eatTimesForToday = snap2.data().eatTimesForToday;
        })
    
    });

    let additionalPriceForBread = (breadPrice * breadPackagesForToday) / eatTimesForToday;

    db.collection("usersUID").get().then(snapshot =>{
        Promise.all(snapshot.docs.map(doc => {
            doc.ref.update({'CheckIndicatorBoolean': false});
            doc.ref.update({'EatTrueFalse': false});
            doc.ref.update({'CheckIndicatorPriceBoolean': false});
            if(eatTimesForToday !== 0){
                doc.ref.update({'PriceDueThisMont': Number(doc.data().PriceDueThisMont + additionalPriceForBread)});
            }
        }));
    })

});



exports.setTime = functions.pubsub.schedule('0 14 * * *').onRun(context => {

    db.doc("dbInfo/time").update({'dayToday': admin.firestore.Timestamp.now()});
    
});

exports.systemPauseAndMonthReport = functions.pubsub.schedule('1 14 * * *').onRun(async context => {

    let dateToday;
    let dateForMonthReport;
    let systemPauseBoolean;
    let systemPauseDateFROM;
    let systemPauseDateTO;


    await db.doc('dbInfo/time').get().then(async snapshot => {
        
        dateToday = snapshot.data().dayToday.toDate().getDate();
        dateToday = dateToday + 1;
    
    });

    await db.doc('dbInfo/monthReport').get().then(async snapshot => {
        
        dateForMonthReport = snapshot.data().dayForMonthlyReport;
    
    });

    await db.doc('dbInfo/systemPause').get().then(async snapshot => {
        
        systemPauseBoolean = snapshot.data().systemPauseBoolean;
        systemPauseDateFROM = snapshot.data().systemPauseDateFROM;
        systemPauseDateTO = snapshot.data().systemPauseDateTO;
    
    });


    if(dateToday == dateForMonthReport){
        console.log("TRUE");

        db.collection("usersUID").get().then(snapshot =>{
            Promise.all(snapshot.docs.map(doc => {
                doc.ref.update({'PriceMustPay': doc.data().PriceDueThisMont});
                doc.ref.update({'PriceDueThisMont': 0});
                doc.ref.update({'PricePaid': false});
            }));
        })
    }

    if(dateToday >= systemPauseDateFROM && dateToday <= systemPauseDateTO){

        db.doc("dbInfo/systemPause").update({'systemPauseBoolean': true});

    }else{

        db.doc("dbInfo/systemPause").update({'systemPauseBoolean': false});
        
    }


});



exports.resetEatTimes = functions.pubsub.schedule('0 0 27 * *').onRun(context => {
    
    db.collection("usersUID").get().then(snapshot =>{
        Promise.all(snapshot.docs.map(doc => {
            doc.ref.update({'EatTimesLastMonth': doc.data().EatTimesThisMonth})
            doc.ref.update({'EatTimesThisMonth': 0})
        }));
    })

});



exports.saveEatTimesForToday = functions.pubsub.schedule('0 14 * * 0-4').onRun(async context => {

    let eatTimesForToday = 0;
    

        await db.collection("usersUID").get().then(snapshot =>{
            Promise.all(snapshot.docs.map(doc => {
                if(doc.data().EatTrueFalse === true){
                    eatTimesForToday++;
                    doc.ref.update({})
                }
            }));
        });

        db.doc("dbInfo/eatTimesForToday").update({'eatTimesForToday': eatTimesForToday});

});



