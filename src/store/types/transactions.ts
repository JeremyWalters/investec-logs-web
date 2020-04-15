type CurrencyCode = "zar";
type TransactionType = "card";

interface Country {
  code: "ZA";
  alpha3: "ZAR";
  name: "South Africa";
}

interface Card {
  id: string;
  display: string;
}

interface Merchant {
  name: string;
  city: string;
  country: Country;
  category: Category;
}

interface Category {
  code: string;
  key: string;
  name: string;
}

export interface Transaction {
  accountNumber: string;
  dateTime: string;
  centsAmount: number;
  currencyCode: CurrencyCode;
  type: TransactionType;
  reference: string;
  card: Card;
  merchant: Merchant;
}
