const https = require('https');
const aws = require('aws-sdk');
const DynamoDBMarshaller = require('@aws/dynamodb-auto-marshaller');
aws.config.region = 'us-east-1';

const autoMarshaller = new DynamoDBMarshaller.Marshaller();

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
            TableName: 'scottie-gg-xxx-blog-posts'
        };
        database.scan(parameters, (error, data) => {
            if (error) {
                reject(error);
            }
            let unmarshalledPosts = data.Items.map((post) => {
                let unmarshalledPost = autoMarshaller.unmarshallItem(post);
                //convert set to array for serialization
                unmarshalledPost.blogPostTags = Array.from(unmarshalledPost.blogPostTags);
                return unmarshalledPost;
            });
            fulfill(unmarshalledPosts.sort((current, other) => {
                return other.postID - current.postID;
            }));
        });
    });
};

getBlogPostForURL = async (blogPostURL) => {
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
            TableName: 'scottie-gg-xxx-blog-posts',
            ScanFilter: {
                'blogPostURL': {
                    'AttributeValueList': [
                        {
                            'S': blogPostURL
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
            let unmarshalledPost = autoMarshaller.unmarshallItem(data.Items[0]);
            //convert set to array for serialization
            unmarshalledPost.blogPostTags = Array.from(unmarshalledPost.blogPostTags);
            fulfill(unmarshalledPost);
        });
    });
};

module.exports = {getAllBlogPosts, getBlogPostForURL};