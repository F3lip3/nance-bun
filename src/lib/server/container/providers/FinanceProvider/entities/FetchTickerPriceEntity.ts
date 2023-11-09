export type FetchTickerPriceEntity = {
  id: string;
  code: string;
};

export type FetchTickerPriceResponse = FetchTickerPriceEntity & {
  price?: number;
};
