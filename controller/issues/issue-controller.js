const Issue = require("../../model/issue");
const Project = require("../../model/project");
const mongoose = require("mongoose");
async function createIssue(req, res) {
    try {
        // Validate request body exists
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        // Destructure required fields
        const { title, description, status, priority, assignedTo, projectId } = req.body;

        // Validate required fields
        if (!title || !description || !assignedTo || !projectId) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['title', 'description', 'assignedTo', 'projectId']
            });
        }

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }
        
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ message: 'Invalid assignedTo ID format' });
        }

        // Create the new issue
        const newIssue = await Issue.create({
            title,
            description,
            status: status || 'open',
            priority: priority || 'low',
            assignedTo,
            projectId
        });

        // Update the project's issues array with the new issue ID
        await Project.findByIdAndUpdate(
            projectId,
            { $push: { issues: newIssue._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json({
            message: 'Issue created successfully',
            data: newIssue
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

async function getAllIssues(req, res){
    try{
        const { projectId } = req.query;
        const query = projectId ? { projectId } : {};
        const issues = await Issue.find(query);
        res.status(200).json(issues);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
async function getIssueById(req, res){
    try{
        const issue = await Issue.findById(req.params.id, {new:true});
        res.status(200).json(issue);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
async function updateIssueById(req, res){
    try{
        // Check if issue exists before updating
        const existingIssue = await Issue.findById(req.params.id);
        if (!existingIssue) {
            return res.status(404).json({
                message: 'Issue not found',
                id: req.params.id
            });
        }

        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            message: 'Issue updated successfully',
            data: updatedIssue
        });
    }
    catch(error){
        console.error('Error updating issue:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid issue ID format',
                error: error.message
            });
        }
        res.status(500).json({
            message: 'Error updating issue',
            error: error.message
        });
    }
}

async function deleteIssueById(req, res) {
    try {
        // Check if issue exists before deleting
        const existingIssue = await Issue.findById(req.params.id);
        if (!existingIssue) {
            return res.status(404).json({
                message: 'Issue not found',
                id: req.params.id
            });
        }

        const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            message: 'Issue deleted successfully',
            data: deletedIssue
        });
    }
    catch (error) {
        console.error('Error deleting issue:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid issue ID format',
                error: error.message
            });
        }
        res.status(500).json({
            message: 'Error deleting issue',
            error: error.message
        });

    }
}

module.exports = {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueById,
    deleteIssueById
}