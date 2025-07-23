const Project = require("../../model/project");

async function createProject(req, res){
    try
    {
       // Validate request body exists
       if (!req.body) {
           return res.status(400).json({message: "Request body is required"});
       }

       const {name, description, createdBy} = req.body;
       
       // Validate required fields
       if (!name || !description || !createdBy) {
           return res.status(400).json({
               message: "Missing required fields: name, description, and createdBy are required"
           });
       }

       const newProject = await Project.create({name, description, createdBy});
       res.status(201).json(newProject);
    }
    catch(error){
        console.log(error);
        
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                details: error.message
            });
        }
        
        if (error.name === 'SyntaxError') {
            return res.status(400).json({
                message: "Invalid JSON format in request body"
            });
        }
        
        res.status(500).json({message: error.message});
    }
}
async function getAllProjects(req, res){
    try{
        const allProjects = await Project.find();
        
        // Check if any projects exist
        if (!allProjects || allProjects.length === 0) {
            return res.status(200).json({
                message: "No projects found",
                data: []
            });
        }
        
        res.status(200).json({
            message: "Projects retrieved successfully",
            count: allProjects.length,
            data: allProjects
        });
    }
    catch(error){
        console.log(error);
        
        // Handle different types of errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid query parameters",
                details: error.message
            });
        }
        
        res.status(500).json({
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
}

async function getProjectById(req, res){
    try{
        // Validate project ID parameter
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                message: "Project ID is required"
            });
        }
        
        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid project ID format"
            });
        }
        
        const project = await Project.findById(id);
        
        // Check if project exists
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                projectId: id
            });
        }
        
        res.status(200).json({
            message: "Project retrieved successfully",
            data: project
        });
    }
    catch(error){
        console.log(error);
        
        // Handle different types of errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid project ID format",
                details: error.message
            });
        }
        
        res.status(500).json({
            message: "Failed to retrieve project",
            error: error.message
        });
    }
}
async function updateProject(req, res){
    try{
        const project =  await Project.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(project);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
async function deleteProjectById(req,res){
    try{
        const project = await Project.findByIdAndDelete(req.params.id)
        res.status(200).json(project);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
module.exports ={
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProjectById
}
