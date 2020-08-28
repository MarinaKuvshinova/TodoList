const { db, admin } = require('../firebase');

exports.users = async (req, res) => {
    const userId = req.user.userId;
    const userData = req.body.userAdd;
    await db.collection('users').get().then(data => {
        let usersProject = [];
        data.forEach(doc => {
            const userValues = Object.values(doc.data());
            if (userData === '' && !userValues.find(a => a.includes(userId))) {

                usersProject.push({id: doc.data().userId, firstName: doc.data().firstName, lastName: doc.data().lastName, imageUrl: doc.data().imageUrl, email: doc.data().email});
            }
            else if(userValues.find(a => a.includes(userData)) && !userValues.find(a => a.includes(userId))) {
                usersProject.push({id: doc.data().userId, firstName: doc.data().firstName, lastName: doc.data().lastName, imageUrl: doc.data().imageUrl, email: doc.data().email});
            }
        });
        res.send(usersProject);
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with search users'});
        console.error(err);
    });
};

exports.usersAddProject = async (req, res) => {
    const userAdd = req.body.userId;
    const selectProject = req.body.selectedProject;

    await db.doc(`/projects/${selectProject}`).update({
        userId: admin.firestore.FieldValue.arrayUnion(userAdd)
    }).then(async data => {
       const project = await db.doc(`/projects/${selectProject}`).get();
       const projectDate = {
           id: selectProject,
           ...project.data()
       };

       await res.send(projectDate);
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with add users to project'});
        console.error(err);
    });
};

exports.usersProject = async (req, res) => {
    const selectProject = req.params.id;
    const userId = req.user.userId;
    let usersInfo = [];
    const usersProject = await db.doc(`/projects/${selectProject}`).get();
    await Promise.all(usersProject.data().userId.map(async uid => {
        await admin.auth().getUser(uid).then(user => db.doc(`/users/${user.email}`).get()).then( doc => {
            if (doc.data().userId !== userId) {
                usersInfo.push({id: doc.data().userId, firstName: doc.data().firstName, lastName: doc.data().lastName, imageUrl: doc.data().imageUrl, email: doc.data().email});
            }
        }).catch( err => {
            console.error(err);
            return res.status(500).json({error: 'Something wrong with get project users'});
        });
    }));

    //console.log("usersInfo", usersInfo);
    res.send(usersInfo);

    // await db.doc(`/projects/${selectProject}`).get().then(async data => {
    //     const usersProject = [...data.data().userId];
    //     await usersProject.forEach(uid => {
    //         admin.auth().getUser(uid)
    //             .then(user => {
    //                 db.doc(`/users/${user.email}`).get().then( doc => {
    //                         usersInfo.push({id: doc.data().userId, firstName: doc.data().firstName, lastName: doc.data().lastName, imageUrl: doc.data().imageUrl, email: doc.data().email});
    //                     }
    //                 );
    //             })
    //             .catch(function(error) {
    //                 console.log('Error fetching user data:', error);
    //             });
    //     });
    // }).then( data => {
    //     console.log("usersInfo", usersInfo);
    //     //res.send(usersInfo);
    // }).catch(err => {
    //     res.status(500).json({error: 'Something wrong with search users some project'});
    //     console.error(err);
    // });
};
