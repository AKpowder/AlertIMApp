import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: 'us-east-1', // Your AWS Cognito Region
    userPoolId: 'us-east-1_JBG1rwzfr', // Your Cognito User Pool ID
    userPoolWebClientId: '75q4tnhufvmh1do44gtnq7stof', // Your Cognito App Client ID
  },
  //using API Gateway and Lambda with Amplify
  API: {
    endpoints: [
      {
        name: "AlertWetRest",
        endpoint: "https://zm520zb0cg.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1"
      },
    ]
  },
  // using S3 with Amplify
  Storage: {
    AWSS3: {
      bucket: 'your-s3-bucket-name', //Your bucket ARN
      region: 'us-east-1', //Specify the region your bucket was created in
    }
  }
});
