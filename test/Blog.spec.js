const expect = require('chai').expect;
const blogService = require('../services/Blog');

describe('Blog service', async () => {
   it('should fetch all blog posts asynchronously', async () => {
       //act
       const allBlogPosts = await blogService.getAllBlogPosts();

       //assert
       expect(allBlogPosts).to.not.be.null;
   });

    it('should fetch a single blog post for a given ID', async () => {
        //arrange
        const blogID = '15';

        //act
        const blogPost = await blogService.getBlogPostForID(blogID);

        //assert
        expect(blogPost).to.not.be.null;
    });
});