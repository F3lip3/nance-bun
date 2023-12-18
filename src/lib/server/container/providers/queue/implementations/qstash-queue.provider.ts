import { env } from '@/lib/env.mjs';

import { PublishResponseEntity } from '../entities/publish-response.entity';
import { IQueueProvider } from '../interfaces/queue.provider';

export class QStashQueueProvider implements IQueueProvider {
  public async publish(
    queue: string,
    data: unknown
  ): Promise<PublishResponseEntity> {
    const jobUrl = `https://${env.VERCEL_URL}/api/jobs/${queue}`;
    const url = `${env.QSTASH_URL}${jobUrl}`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.QSTASH_TOKEN}`
      }
    });

    const publishResponse = (await response.json()) as PublishResponseEntity;

    return publishResponse;
  }
}
