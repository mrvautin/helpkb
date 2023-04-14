import { getServerSession } from 'next-auth'
import { authOptions } from './[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('sess', session);
  // Check for session
  if(!session){
    res.status(200).send({error: 'No valid session'});
    return;
  }
  res.status(200).send(session.user);
  return;
}