/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dict } from '@app/types/CommonTypes';

export type RestErrorMessage = string | Dict<any> | Array<any>;

export interface RestErrorResponse {
  message: RestErrorMessage;
}
