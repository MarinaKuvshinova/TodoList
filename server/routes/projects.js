const { db, admin } = require('../firebase');

exports.projects = async (req, res) => {
    const userId = req.user.userId;

    await db.collection('projects').get().then( async data => {
        let projects = [];
        await data.forEach(doc => {
            if(doc.data().userId.includes(userId)) {
                projects.push({id:doc.id, data:doc.data()});
            }
        });

////work
        // await db.collection('projects').get().then( async data => {
        //     let projects = [];
        //     data.forEach(doc => {
        //         console.log("doc.data().userId", doc.data().userId, doc.data().userId.includes(userId));
        //         if(doc.data().userId.includes(userId)) {
        //             projects.push({id:doc.id, data:doc.data()});
        //         }
        //     });


        res.send(projects);
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with projects user'});
        console.error(err);
    });
};
exports.projectAdd = async (req, res) => {
    const project = {
        name: req.body.name,
        userId: [req.user.userId]
    };
    await db.collection("projects").add(project).then( data => {
        res.send(true);
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with project add'});
        console.error(err);
    });

};
exports.projectDelete = async (req, res) => {
    const projectId = req.params.id;
    const user = req.user.userId;

    const users = await db.doc(`/projects/${projectId}`).get();

    if (users.data().userId.length > 1) {
        await db.collection("projects").doc(projectId).update({
            userId: admin.firestore.FieldValue.arrayRemove(user)
        }).then( () =>
            res.send(true)
        ).catch(err => {
            res.status(500).json({error: 'Something wrong with project delete'});
            console.error(err);
        });
    } else {
        await db.collection("projects").doc(projectId).delete().then( data => {
            db.collection('tasks').where("projectId", "==", projectId).get().then(querySnapshot => {
                querySnapshot.docs.forEach((doc) => {
                    doc.ref.delete();
                });
            });
            res.send(true);
        }).catch(err => {
            res.status(500).json({error: 'Something wrong with project delete'});
            console.error(err);
        });
    }
};