import { createHash } from 'crypto';

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}
export { sha256 };
