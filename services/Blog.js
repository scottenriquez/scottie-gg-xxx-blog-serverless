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
            TableName: 'blog'
        };
        database.scan(parameters, (error, data) => {
            if (error) {
                reject(error);
            }
            fulfill(data.Items.map((post) => {
                let unmarshalledPost = autoMarshaller.unmarshallItem(post);
                //convert set to array for serialization
                unmarshalledPost.BlogTags = Array.from(unmarshalledPost.BlogTags);
                return unmarshalledPost;
            }));
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
            let unmarshalledPost = autoMarshaller.unmarshallItem(data.Items[0]);
            //convert set to array for serialization
            unmarshalledPost.BlogTags = Array.from(unmarshalledPost.BlogTags);
            fulfill(unmarshalledPost);
        });
    });
};

module.exports = {getAllBlogPosts, getBlogPostForID};