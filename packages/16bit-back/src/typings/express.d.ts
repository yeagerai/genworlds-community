import { Optional } from '@app/types/CommonTypes';

declare global {
  namespace Express {
    interface Request {
      authToken: Optional<string>;
    }
  }
}
