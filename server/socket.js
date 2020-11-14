module.exports = (io) => {
    io.on('connection', socket => {
        console.log(`user connected  with socket id ${socket.id}`);

        socket.on("task check", idTask => {
            socket.broadcast.emit("check", idTask);
        });

        socket.on('join', (projectId) => {
            socket.join(projectId.selectedProject ? projectId.selectedProject : projectId);
        });
        socket.on('task add', task => {
            if (task.usersTask.length > 1)
                socket.broadcast.to(task.projectId).emit('add', task);
        });

        socket.on('project', project => {
            socket.broadcast.to(project.id).emit('project', project);
        });

        socket.on('chat', ({message, projectId}) => {
           socket.broadcast.to(projectId).emit('chat', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    })
};