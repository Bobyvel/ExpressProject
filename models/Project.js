const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({
  name: { type: Schema.Types.String, required: true , unique: true},
  description: { type: Schema.Types.String, required: true }, 
  team: { type: Schema.Types.ObjectId, ref: 'Team' }
});

projectSchema.path('description')
    .validate(function(){
        return this.description.length > 0 && this.description.length <= 50;
    }, 'Description must be between 1 and 50 symbols!');
    
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;