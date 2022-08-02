import { IUser } from '../users/user.interface';

export interface IContribution {
  user: IUser;
  amount: number;
  type: string;
  month: string;
}
