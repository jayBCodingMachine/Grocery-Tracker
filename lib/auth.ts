import { Amplify } from 'aws-amplify';

const authConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
            loginWith: {
                oauth: {
                    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
                    scopes: ['openid', 'email', 'profile'],
                    redirectSignIn: ['http://localhost:3000/auth/callback'],
                    redirectSignOut: ['http://localhost:3000/login'],
                    responseType: 'code' as const,
                },
            },
        },
    },
};

export function configureAmplify() {
    Amplify.configure(authConfig, { ssr: true });
}

export { authConfig };
