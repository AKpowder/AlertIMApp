import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: 'us-east-1', // Your AWS Cognito Region
        userPoolId: 'us-east-1_Tk3fof48W', // Your Cognito User Pool ID
        userPoolWebClientId: 'exampleclientid', // Your Cognito App Client ID
    }
    // API: {
    //     endpoints: [
    //         {
    //             name: "YourAPIName",
    //             endpoint: "https://yourapi.execute-api.us-east-1.amazonaws.com/prod",
    //             region: "us-east-1"
    //         },
    //     ]
    // }
});