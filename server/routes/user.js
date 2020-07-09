const firebase = require('firebase');
const { admin, db } = require('../firebase');
const config = require('../config');
const { uuid } = require('uuidv4');
firebase.initializeApp(config);


exports.signUp = async (req, res) => {
    const newUser = {
        ...req.body
    };

    const noImg = 'no-img.png';

    let token, userId;
    await db.doc(`/users/${newUser.email}`).get().then((doc) => {
        if (doc.exists) {
            return res.status(200).send({general: 'This email is already using'});
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    }).then((data) => {
        if (data.user) {
            userId = data.user.uid;
            return data.user.getIdToken();
        }
    }).then(idToken => {
        if (idToken) {
            token = idToken;
            const user = {
                ...newUser,
                userId,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`
            };
            return db.doc(`/users/${newUser.email}`).set(user);
        }
    }).then(() => {
        if (token)
            return res.status(201).json({token});
    }).catch(err => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
            res.status(400).json({ general: "Email is already using" });
        } else {
            res.status(500).json({error: 'Something wrong with signUp'});
        }
    });
};
exports.signIn = async (req, res) => {
    const user = {
        ...req.body
    };
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(data => {
        //console.log(data.user);
        return data.user.getIdToken();
    }).then(token => {
        return res.send({token});
    }).catch(err => {
        console.error(err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            res.status(400).json({general: 'Wrong email or password, please try again'});
        } else {
            res.status(500).json({error: 'Something wrong with signIn'});
        }
    });
};
exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");


    const busboy = new BusBoy({ headers: req.headers });


    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
    let generatedToken = uuid();
    // req.on('data', function(d) {
    //     console.dir(d.toString());
    // });

    // fileStream.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //     console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    //     res.end();
    // });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        //console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" });
        }
        // my.image.png => ['my', 'image', 'png']
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));

        // file.on('data', function(data) {
        //     console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        // });
        // file.on('end', function() {
        //     console.log('File [' + fieldname + '] Finished');
        // });
    });
    // busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //    // console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // });
    busboy.on('finish', function() {
        //console.log('Done parsing form!');
        //res.writeHead(303, { Connection: 'close', Location: '/' });
        let name;
        admin
            .storage()
            .bucket(config.storageBucket)
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                        //Generate token to be appended to imageUrl
                        firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                // Append token to url
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;

                db.doc(`/users/${req.user.email}`).get().then(doc => {
                    name = doc.data().imageUrl.split('/o/')[1].split('?alt=media&token=')[0];
                });


                db.doc(`/users/${req.user.email}`).update({ imageUrl }).then(()=>{
                    if (name !== 'no-img.png') {
                        admin
                            .storage()
                            .bucket(config.storageBucket).file(name).delete().then(()=>{
                            console.log(name);
                        });
                    }
                });

            })
            .then(() => {
                res.json({ message: "image uploaded successfully" });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "something went wrong" });
            });
//        res.end();

    });
    req.pipe(busboy);

    // busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    //
    //     console.log('filename', filename);
    //     if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
    //         return res.status(400).json({ error: "Wrong file type submitted" });
    //     }
    //     // my.image.png => ['my', 'image', 'png']
    //     const imageExtension = filename.split(".")[filename.split(".").length - 1];
    //     // 32756238461724837.png
    //     imageFileName = `${Math.round(
    //         Math.random() * 1000000000000
    //     ).toString()}.${imageExtension}`;
    //     console.log("imageFileName", imageFileName);
    //     console.log("imageExtension", imageExtension);
    //     console.log("path", path);
    //     const filepath = path.join(os.tmpdir(), imageFileName);
    //     imageToBeUploaded = { filepath, mimetype };
    //     file.pipe(fs.createWriteStream(filepath));
    // });
    // busboy.on("finish", () => {
    //     admin
    //         .storage()
    //         .bucket(`${config.storageBucket}`)
    //         .upload(imageToBeUploaded.filepath, {
    //             resumable: false,
    //             metadata: {
    //                 metadata: {
    //                     contentType: imageToBeUploaded.mimetype,
    //                     //Generate token to be appended to imageUrl
    //                     firebaseStorageDownloadTokens: generatedToken,
    //                 },
    //             },
    //         })
    //         .then(() => {
    //             // Append token to url
    //             const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
    //             return db.doc(`/users/${req.user.email}`).update({ imageUrl });
    //         })
    //         .then(() => {
    //             return res.json({ message: "image uploaded successfully" });
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             return res.status(500).json({ error: "something went wrong" });
    //         });
    // });
    // busboy.end(req.rawBody);
};
exports.userDetails = async (req, res) => {
     let userDetails = {...req.body};
     db.doc(`/users/${req.user.email}`).update(userDetails)
         .then(() => {
             return res.json({message: 'Details added successfully'});
         })
         .catch((err) => {
             console.error(err);
             res.status(500).json({error: 'Something wrong with update user details'});
     });
};
exports.getUser = async (req, res) => {
    db.doc(`/users/${req.user.email}`).get()
        .then( doc => {
            const info = {};
            Object.entries(doc.data()).forEach(([key, value]) => {
                if (key !== 'password') {
                    info[key] = value;
                }
            });
            if(doc.exists){
                res.send(info);
            }
        }).catch((err) => {
        console.error(err);
        res.status(500).json({error: 'Something wrong with update user details'});
    });
};