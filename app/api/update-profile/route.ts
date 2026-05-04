import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, image } = body;
 
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }
 
    // Update user using Better Auth
    const updatedUser = await auth.api.updateUser({
      body: {
        userId,
        name,
        image,
      },
    });
 
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
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



