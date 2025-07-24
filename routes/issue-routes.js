const express = require('express');
const router = express.Router();
const { createIssue, getAllIssues, getIssueById, updateIssueById, deleteIssueById } = require('../controller/issues/issue-controller');

router.post('/create', createIssue);
router.get('/all', getAllIssues);   
router.get('/:id', getIssueById);
router.put('/:id', updateIssueById);
router.delete('/:id', deleteIssueById);

module.exports = router;