const blogService = require('./services/Blog');

exports.handler = async (event) => {
    let result = {};
    if (event['queryStringParameters'] && event['queryStringParameters']['postID']) {
        result = await blogService.getBlogPostForID(event['queryStringParameters']['postID']);
    }
    else {
        result = await blogService.getAllBlogPosts();
    }
    const response = {
        'isBase64Encoded': false,
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': JSON.stringify(result)
    };
    return response;
};