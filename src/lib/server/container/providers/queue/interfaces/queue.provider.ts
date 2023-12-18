import { PublishResponseEntity } from '../entities/publish-response.entity';

export interface IQueueProvider {
  publish(queue: string, data: unknown): Promise<PublishResponseEntity>;
}
