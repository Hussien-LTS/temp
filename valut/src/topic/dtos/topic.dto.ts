export interface TopicDto {
  TransactionId: string;
  topicList: TopicList[];
}

interface TopicList {
  TopicType: string;
  TopicID: string;
  TopicDescription: string;
  ExternalId: string;
}

export class TopicApiResponse {
  responseStatus: string;
  responseDetails: ResponseDetails;
  data: CatalogItem[];
}

export interface ResponseDetails {
  next_page: string;
  total: number;
  offset: number;
  limit: number;
  url: string;
  object: ObjectDetails;
}

export interface ObjectDetails {
  url: string;
  label: string;
  name: string;
  label_plural: string;
  prefix: string;
  order: number;
  in_menu: boolean;
  source: string;
  status: string[];
  configuration_state: string;
}

export interface CatalogItem {
  id: string;
  name__v: string;
}
