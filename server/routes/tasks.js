const { db, admin } = require('../firebase');


exports.tasks = async (req, res) => {
    const userId = req.user.userId;
    const tasksProject = [];
    const infoUser = await admin.auth().getUser(userId).then(user => db.doc(`/users/${user.email}`).get());
    const tasks = await db.collection('tasks').where("userId", "array-contains", infoUser.data().userId).get();

    await Promise.all(tasks.docs.map(async task => {
        const usersTask = [];
        await Promise.all(task.data().userId.map(async userId => {
            await admin.auth().getUser(userId).then(user => db.doc(`/users/${user.email}`).get()).then( user => {
                if (!usersTask.includes(user.data()) && user.data().userId!==req.user.userId)  usersTask.push({id: user.data().userId, imageUrl: user.data().imageUrl, firstName: user.data().firstName, lastName: user.data().lastName});
            }).catch( err => {
                console.error(err);
                return res.status(500).json({error: 'Something wrong with tasks user'});
            });
        }));
        await tasksProject.push({id: task.id, data: task.data(), usersTask});
    }));
   res.send(tasksProject);
};

//old version
// exports.tasks = async (req, res) => {
//     const userId = req.user.userId;
//     await db.collection('tasks').orderBy('projectId').get().then(data => {
//         let tasks = [];
//         let usersInfo = [];
//         data.forEach(async doc => {
//             let usersTask = doc.data().userId;
//             if (Array.isArray(doc.data().userId)){
//                 await  usersTask.forEach(uid => {
//                     admin.auth().getUser(uid)
//                         .then(async user => {
//                             await db.doc(`/users/${user.email}`).get().then( user => {
//                                     usersInfo.push({id: user.data().userId, imageUrl: user.data().imageUrl});
//                                     if(doc.data().userId.includes(userId)) {
//                                         tasks.push({id:doc.id, data:doc.data(), usersInfo: usersInfo});
//                                     } else {
//                                         tasks.push({id:doc.id, data:doc.data()});
//                                     }
//                                     console.log(tasks);
//                                 }
//                             );
//                         })
//                         .catch(err => {
//                             console.error(err);
//                             res.status(500).json({error: 'Something wrong with tasks user'});
//                         });
//                 });
//             }
//             // else {
//             //     if(doc.data().userId.includes(userId)) {
//             //         return tasks.push({id:doc.id, data:doc.data()});
//             //     }
//             // }
//             //console.log("tasks", tasks);
//         });
//         console.log(tasks);
//         res.send(tasks);
//
//     }).catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'Something wrong with tasks user'});
//     });
// };

exports.taskAdd = async (req, res) => {
    //console.log("req.body.userId", req.body.userId);
    // console.log("req.user.userId", req.user.userId);
    const userId =  req.body.userId ? [req.user.userId, ...req.body.userId] : [req.user.userId];

    const task = {
        ...req.body,
        dateCreate: Date.now(),
        userId: req.body.userId ? [req.user.userId, ...req.body.userId] : [req.user.userId]
    };
    //console.log("task.userId", task.userId);
    const usersTask = [];
   await db.collection("tasks").add(task).then( async data => {
        //res.send({userId: req.user.userId, id: data.id});


       await Promise.all(userId.map(async (uid) => {
               await admin.auth().getUser(uid).then(user => db.doc(`/users/${user.email}`).get()).then( user => {
                   // if (!usersTask.includes(user.data()) && user.data().userId!==req.user.userId)  usersTask.push({id: user.data().userId, imageUrl: user.data().imageUrl, firstName: user.data().firstName, lastName: user.data().lastName});

                   if (!usersTask.includes(user.data()))  usersTask.push({id: user.data().userId, imageUrl: user.data().imageUrl, firstName: user.data().firstName, lastName: user.data().lastName});
               }).catch( err => {
                   console.error(err);
                   return res.status(500).json({error: 'Something wrong with tasks user'});
               });
       }));

       res.send({usersTask, id: data.id});
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with task add'});
        console.error(err);
    });
};
exports.taskDelete = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const lenght = await db.collection("tasks").doc(taskId).get()
        .then(querySnapshot => {
            return querySnapshot.data().userId.length;
        });
//new
    if (lenght === 1) {
        await db.collection("tasks").doc(taskId).delete().then( data => {
            res.send(true);
        }).catch(err => {
            res.status(500).json({error: 'Something wrong with task delete'});
            console.error(err);
        });
    } else {
        await db.collection("tasks").doc(taskId).update('userId', admin.firestore.FieldValue.arrayRemove(userId)).then( data => {
            res.send(true);
        }).catch(err => {
            res.status(500).json({error: 'Something wrong with task delete'});
            console.error(err);
        });
    }
//     await db.collection("tasks").doc(taskId).update('userId', admin.firestore.FieldValue.arrayRemove(userId)).then( data => {
//         res.send(true);
//     }).catch(err => {
//         res.status(500).json({error: 'Something wrong with task delete'});
//         console.error(err);
//     });

    ///old version
    // db.collection("tasks").doc(taskId).delete().then( data => {
    //     res.send(true);
    // }).catch(err => {
    //     res.status(500).json({error: 'Something wrong with task delete'});
    //     console.error(err);
    // });
};
exports.taskCheck = async (req, res) => {
    const taskId = req.params.id;
    await db.collection("tasks").doc(taskId).update({archived: true}).then( data =>
        res.send(true)
    ).catch(err => {
        res.status(500).json({error: 'Something wrong with task check'});
        console.error(err);
    });
};

