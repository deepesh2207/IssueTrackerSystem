const express = require('express');
const { createProject, getAllProjects, getProjectById, updateProject, deleteProjectById } = require('../controller/project/project-controller');
const router = express.Router();

router.post('/create', createProject);
router.get('/all', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProjectById);

module.exports = router;
