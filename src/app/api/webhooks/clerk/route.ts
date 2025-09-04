import { NextRequest } from 'next/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { createUser, getUserById, UpdateUser } from '@/lib/users'
import { User } from '../../../../../node_modules/@prisma/client' 

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data

        if (!id || !email_addresses) {
        return new Response('Error occurred -- missing data', {
            status: 400
        })
        }

        const user = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {})
        }

        await createUser(user as User);
        // console.log(userCreated);
    }

    if(eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data

        if (!id || !email_addresses) {
        return new Response('Error occurred -- missing data', {
            status: 400
        })
        }

        const { user } = await getUserById({clerkUserId :id});
        if(!user) {
            return new Response('Failed to update user in db', { status: 400 });
        }
        const updatedUser = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {})
        }

        await UpdateUser(user.id, updatedUser as User);
        // console.log(userCreated);
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}