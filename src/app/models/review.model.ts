import { User } from './user.model';
import { Destination } from './destination.model';

export interface Review {
  id?: number;
  user: User;
  destination: Destination;
  rating: number;
  comment: string;
  createdAt: Date;
}

