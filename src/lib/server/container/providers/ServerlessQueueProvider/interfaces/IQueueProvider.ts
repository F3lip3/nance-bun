import { PublishResponseEntity } from '../entities/PublishResponseEntity';

export interface IQueueProvider {
  publish(queue: string, data: unknown): Promise<PublishResponseEntity>;
}
