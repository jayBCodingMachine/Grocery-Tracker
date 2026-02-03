import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    tokenUse: 'access',
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
});

export interface VerifiedToken {
    userId: string;
    email?: string;
}

export async function verifyToken(token: string): Promise<VerifiedToken | null> {
    // Dev bypass mode
    if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' && token === 'dev_token') {
        return { userId: 'dev_user', email: 'dev@localhost' };
    }

    try {
        const payload = await verifier.verify(token);
        return {
            userId: payload.sub,
            email: payload.email as string | undefined,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function extractToken(request: Request): string | null {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.slice(7);
}
