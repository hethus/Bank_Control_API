export class Bank {
  name: string;
  value?: number;
  credit?: Credit;
  debts?: Debt[];
  currencys?: Currency[];
  createdAt?: Date;
  updatedAt?: Date;
}

class Frequency {
  time: string;
  isAlive: boolean;
} //

class Currency {
  name: string;
  value: number;
  isFrequent: boolean;
  frequency?: Frequency;
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

class Debt {
  name: string;
  price: number;
  isCredit: boolean;
  isFrequent: boolean;
  frequency?: Frequency;
  origin: string;
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

export class Credit {
  name: string;
  value: number;
  dueDate: Date;
  isAlive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
