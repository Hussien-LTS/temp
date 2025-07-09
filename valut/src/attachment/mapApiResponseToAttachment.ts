import { AttachmentDto } from './dtos/attachment.dto';

export function mapApiResponseToAttachment(data: any): any {
  console.log(
    '🚀 ~ mapApiResponseToAttachment ~ data:',
    data,
  );
 
 if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.id ?? null,
    Body: item.filename__v ?? null,
    ContentType: item.format__v ?? null,
    Name: item.filename__v ?? null,
    eventId: item.event_id ?? 'a2v5C000000YhJ0QAK',
    TransactionId: item.transaction_id ?? 'VIRZ08LKW9549TF',
    AttachmentId: item.attachment_id ?? '00P5C000000VBZGUA4',
    BodyLength: item.size__v ?? null,
  }));
}