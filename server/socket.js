
module.exports = (io) => {
    io.on('connection', socket => {
        console.log(`user connected  with socket id ${socket.id}`);

        // socket.on("join", (id, users) => {
        //     socket.join(id);
        // });
        //
        socket.on("task check", idTask => {
            socket.broadcast.emit("check", idTask);
        });

        // socket.on("task add", task => {
        //     //console.log("task", task);
        //     socket.broadcast.emit("add", task);
        // });


        socket.on('join', (projectId) => {
            //console.log(`Socket ${socket.id} joining ${projectId}`);
            socket.join(projectId);
        });
        socket.on('task add', task => {
            //console.log(task);
//            console.log(`msg: ${message}, taskId: ${taskId}`);
            if (task.usersTask.length > 1)
                socket.broadcast.to(task.projectId).emit('add', task);
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