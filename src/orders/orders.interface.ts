import { IUser } from '../users/user.interface';

export interface IOrder {
  user: IUser;
  dish: number;
}
