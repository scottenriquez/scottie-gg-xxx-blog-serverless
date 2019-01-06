const blogService = require('./services/Blog');

exports.handler = async (event) => {
    const allBlogPosts = await blogService.getAllBlogPosts();
    return JSON.stringify(allBlogPosts);
};