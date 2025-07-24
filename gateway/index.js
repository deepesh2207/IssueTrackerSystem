const express = require('express');
const app = express();
const connectDB = require('../connect');
const projectRoutes = require('../routes/project-routes');
const issueRoutes = require('../routes/issue-routes');

// JSON parsing middleware with error handling
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            message: 'Invalid JSON format in request body',
            error: 'Please check your JSON syntax'
        });
    }
    next();
});

connectDB();

// Project routes
app.use('/project', projectRoutes);
app.use('/project/:id', projectRoutes);

// Issue routes
app.use('/issue', issueRoutes);
app.use('/issue/:id', issueRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
