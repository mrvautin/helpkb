import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
const prisma = require('../../../lib/prisma');

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session }) {
            if (session && session.user.email) {
                // If sessiona dn email found, grab from db
                const userAccount = await prisma.users.findFirst({
                    where: {
                        email: session.user.email,
                        enabled: true,
                    },
                });
                if (!userAccount) {
                    return session;
                }
                // Set values from the DB
                session.user.id = userAccount.id;
                session.user.enabled = userAccount.enabled;
                session.user.admin = userAccount.admin;
                session.user.owner = userAccount.owner;
                session.user.created_at = userAccount.created_at;

                // Overwrite the name from our DB
                session.user.name = userAccount.name;
            }
            return session;
        },
        redirect: async () => {
            return Promise.resolve(
                `${process.env.NEXTAUTH_URL}/admin/dashboard`,
            );
        },
        async signIn({ user }) {
            const userAccount = await prisma.users.findFirst({
                where: {
                    email: user.email,
                    enabled: true,
                },
            });

            if (!userAccount) {
                return false;
            }
            return true;
        },
    },
};
export default NextAuth(authOptions);
