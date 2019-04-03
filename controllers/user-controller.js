const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const mongoose = require('mongoose');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                profilePicture: reqUser.profilePicture,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },
    profileGet: async (req, res) => {
        if(req.user)
        {
        const userId = req.user.id
        const teams = await Team.find({ 'members': mongoose.Types.ObjectId(userId) });
        const projects = await Project.find().where('team')
        .in(teams);
        const user = await User.findById(userId);

        res.render('users/profile', {teams, projects, user});
        }
       
    },
    leaveTeamPost: async (req, res) => {
        const teamId = req.body.teamId;
        const userId = req.user.id
        console.log(teamId)
        await Team.findOneAndUpdate({_id: teamId}, {$pull: { 'members': mongoose.Types.ObjectId(userId) }})
        res.redirect('/profile');
        
    }
};