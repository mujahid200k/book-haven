import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image } = body; // userId সরিয়ে দিলাম

    // Update user using Better Auth
    await auth.api.updateUser({
      headers: request.headers, // session থেকে user identify করবে
      body: {
        name,
        image,
      },
    });
 
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      // user: updatedUser ← এটা সরিয়ে দিলাম
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
