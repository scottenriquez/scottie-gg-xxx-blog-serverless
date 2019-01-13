const blogService = require('./services/Blog');

exports.handler = async (event) => {
    return await blogService.getAllBlogPosts();
};