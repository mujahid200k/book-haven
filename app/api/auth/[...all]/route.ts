import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const dynamic = 'force-dynamic'; // ✅ এটা যোগ করো

export const { GET, POST } = toNextJsHandler(auth);