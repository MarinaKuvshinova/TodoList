const {admin, db} = require('./firebase');

module.exports = async (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
    // if(req.headers.cookie && req.headers.cookie.startsWith('token=')){
    //     idToken = req.headers.cookie.split('token=')[1];
    // } else {
        console.error('Unauthorized, no token found');
        return res.status(403).json({error: 'Unauthorized'});
    }
    await admin.auth().verifyIdToken(idToken).then(decodedToken => {
        req.user = decodedToken;

        admin.auth().createSessionCookie(idToken, {expiresIn: 60*60*1000});
        return db.collection('users').where('userId', '==', req.user.uid).limit(1).get().then(data => {

            req.user.userId = req.user.uid;
            return next();
        }).catch((err) => {
            console.error(err);
            res.status(500).json({error: 'Something wrong with verifying token'});
        })
    });
};