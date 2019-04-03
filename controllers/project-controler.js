const Project = require('../models/Project');
const Team = require('../models/Team');

module.exports = {
    projectsManageGet: async (req, res) => {
        try {
            const projects = await Project.find({'team' : null})
            const teams = await Team.find()
            res.render('projects/projects', {teams, projects});
          } catch (err) {
            console.log(err)
          }
       
    },
    projectsManagePost:  async (req, res) => {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId

        try {
            const project = await Project.findById(projectId)
            project.team = teamId;
            await project.save()
            const team = await Team.findById(teamId)
            team.projects.push(projectId)
            await team.save()
            res.redirect('/');
          } catch (err) {
            console.log(err)
          }
       
    },
    addGet: (req, res) => {
        res.render('projects/add');
    },
    addPost: async (req, res) => {
        const project = req.body
        try {
          await Project.create({
            name: project.name,
            description: project.description
        })
          res.redirect('/')
        } catch (err) {
          console.log(err)
        }
    
    },
    projectsUserGet: async (req, res) => {
      try {
          const projects = await Project.find().populate('team')
          res.render('projects/projectUser', {projects});
        } catch (err) {
          console.log(err)
        }
     
  },
  search: async (req, res) => {
    const project = req.body.name
    try {
      let projects = await Project.find({ 'name': { $regex: project, $options: 'i' }})
     
      res.render('projects/projectUser', { projects })
    } catch (err) {
      console.log(err)
    }
  }
};

