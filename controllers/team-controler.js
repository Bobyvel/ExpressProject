const Team = require('../models/Team');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = {
    teamAllGet: async (req, res) => {
      try {
          const users = await User.find();
          const teams = await Team.find();
          res.render('teams/teams', {users, teams});
        } catch (err) {
          console.log(err);
        }
        
    },
    teamAllPost: async (req, res) => {
        const userId = req.body.username;
        const teamId = req.body.teamId;

        try {

          const team = await Team.findById(teamId);
          if(team.members.indexOf(mongoose.Types.ObjectId(userId)) > -1){
          res.locals.globalError = 'User already included!';
          res.redirect('/');
          return
          }
          team.members.push(userId);
          await team.save();
                
          const user = await User.findById(userId);
          user.teams.push(teamId);
          await user.save();
         
          res.redirect('/');
        } catch (err) {
          console.log(err);
        }
        
  },
    addTeamGet: (req, res) => {
        res.render('teams/add');
    },
    addTeamPost: async (req, res) => {
        const team = req.body.name;
        try {
          await Team.create({
            name: team
        })
          res.redirect('/');
        } catch (err) {
          console.log(err);
        }
    
    },
    teamUserGet: async (req, res) => {
      const teams = await Team.find().populate('projects members');
      res.render('teams/teamsUser', {teams});
     
  },
  search: async (req, res) => {
    const project = req.body.name
    try {
      let teams = await Team.find({ 'name': { $regex: project, $options: 'i' }})
      res.render('teams/teamsUser', { teams })
    } catch (err) {
      console.log(err)
    }
  }
    
};