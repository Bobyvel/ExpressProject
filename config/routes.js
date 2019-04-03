const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/register', restrictedPages.isAnonymous,  controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous,  controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed,controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous,  controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous,  controllers.user.loginPost);
    app.get('/profile', restrictedPages.isAuthed, controllers.user.profileGet)

    // projects admin
    app.get('/addProject', restrictedPages.hasRole('Admin'), controllers.project.addGet);
    app.post('/addProject', restrictedPages.hasRole('Admin'),  controllers.project.addPost);
    app.get('/projects', restrictedPages.hasRole('Admin'), controllers.project.projectsManageGet);
    app.post('/projects', restrictedPages.hasRole('Admin'), controllers.project.projectsManagePost);

    //projects user
    app.get('/viewProject',restrictedPages.isAuthed, controllers.project.projectsUserGet);
    app.post('/searchProject',restrictedPages.isAuthed, controllers.project.search);

    //team user
    app.get('/viewTeams',restrictedPages.isAuthed, controllers.team.teamUserGet);
    app.post('/searchTeam',restrictedPages.isAuthed, controllers.team.search);

    app.post('/leave', restrictedPages.isAuthed, controllers.user.leaveTeamPost);
    
    //teams
    app.get('/addTeam', restrictedPages.hasRole('Admin'), controllers.team.addTeamGet);
    app.post('/addTeam', restrictedPages.hasRole('Admin'), controllers.team.addTeamPost);
    app.get('/teams', restrictedPages.hasRole('Admin'),  controllers.team.teamAllGet);
    app.post('/teams', restrictedPages.hasRole('Admin'),  controllers.team.teamAllPost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};