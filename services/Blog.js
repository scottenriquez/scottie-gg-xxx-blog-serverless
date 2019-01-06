const https = require('https');
const aws = require('aws-sdk');
aws.config.region = 'us-east-1';

getAllBlogPosts = async () => {
    return new Promise((fulfill, reject) => {
        const database = new aws.DynamoDB({
            httpOptions: {
                agent: new https.Agent({
                    rejectUnauthorized: true,
                    keepAlive: true,
                    secureProtocol: 'TLSv1_method',
                    ciphers: 'ALL'
                })
            }
        });
        const parameters = {
            TableName: 'blog'
        };
        database.scan(parameters, (error, data) => {
            if (error) {
                reject(error);
            }
            fulfill(data);
        });
    });
};

getBlogPostForID = async (blogID) => {
    return new Promise((fulfill, reject) => {
        const database = new aws.DynamoDB({
            httpOptions: {
                agent: new https.Agent({
                    rejectUnauthorized: true,
                    keepAlive: true,
                    secureProtocol: 'TLSv1_method',
                    ciphers: 'ALL'
                })
            }
        });
        const parameters = {
            TableName: 'blog',
            ScanFilter: {
                'PostID': {
                    'AttributeValueList': [
                        {
                            'S': blogID
                        }
                    ],
                    'ComparisonOperator': 'EQ'
                }
            }
        };
        database.scan(parameters, (error, data) => {
            if (error) {
                reject(error);
            }
            fulfill(data);
        });
    });
};

module.exports = {getAllBlogPosts, getBlogPostForID};