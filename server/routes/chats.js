const { db, admin } = require('../firebase');
const { uuid } = require('uuidv4');

exports.chatCreate = async (req, res) => {
    const selectProject = req.body.selectedProject;
    await db.collection('chats').doc(selectProject).set({}, { merge: true });
};
exports.allMessage = async(req, res) => {
    const project = req.body.selectedProject;
    const chat = await db.collection("chats").doc(project).get();
    const messagesArray = [];
    if (chat.exists) {
        if (chat.data().messages) {
            await Promise.all(chat.data().messages.map( async data => {
                const email = data.user;
                const user = await db.doc(`/users/${email}`).get();
                messagesArray.push({uid:uuid(), data: {message: data.message, dateCreate: data.dateCreate, userInfo: {name: `${user.data().firstName} ${user.data().lastName}`, imageUrl: user.data().imageUrl}}});
            }));
            messagesArray.sort((a, b) => {
                return a.data.dateCreate - b.data.dateCreate;
            });
        }
        res.send({messages:messagesArray});
    } else {
        res.send(true);
    }

};
exports.sendMessage = async (req, res) => {
    const message = req.body.message;
    const project = req.body.selectedProject;
    const user = req.user.email;

    const sms = {
        user,
        message,
        dateCreate: Date.now()
    };

    await db.collection("chats").doc(project).update({
        messages: admin.firestore.FieldValue.arrayUnion(sms)
    }).then( data => {
        res.send(true);
    }).catch(err => {
        res.status(500).json({error: 'Something wrong with add message'});
        console.error(err);
    });
};