
module.exports = (io) => {
    io.on('connection', socket => {
        console.log(`user connected  with socket id ${socket.id}`);

        // socket.on("join", (id, users) => {
        //     socket.join(id);
        // });
        //
        socket.on("task check", idTask => {
            io.emit("check", idTask);
        });

        socket.on("create task", task => {
            //console.log("task", task);
            io.emit("add task", task);
        });



        // socket.on('join', (projects) => {
        //
        //
        //     projects.forEach(project => console.log(project));
        // } );
        //
        // socket.on('join', ({selectedProject}) => {
        //     // console.log("user join(userId, project)", userId, selectedProject);
        //     // socket.broadcast.to(selectedProject).emit('welcome_message', {user: userId, text: `${userId} has joined`});
        //     // socket.emit('welcome_message', {user: userId, text: `Welcome ${userId} to project ${selectedProject}`});
        //     socket.join(selectedProject);
        // });

       //  socket.on('task', ({id, users}) => {
       //      users.forEach(id => {
       //          socket.join(id);
       //          console.log("id user in task socket", id);
       //      });
       //
       //      // console.log("task");
       //      // socket.emit('done_task', id);
       //      //socket.join(id);
       // });


        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    })
};