const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://todolist-ffba3.firebaseio.com/'
});
const db = admin.firestore();

module.exports = {admin, db};
