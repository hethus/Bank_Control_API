export class Historic {
  operation: string;
  where: string;
  debt?: Debt;
  credit?: Credit;
  mark?: Mark;
  bank?: Bank;
  currency?: Currency;
  commit?: Commit;
}

class Frequency {
  time: string;
  isAlive: boolean;
} //

class Constancy {
  from: string;
  date: Date;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
} //

class Bank {
  name: string;
  value?: number;
  credit?: Credit;
  Debts?: Debt[];
  currencys?: Currency[];
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

class Currency {
  name: string;
  value: number;
  isFrequent: boolean;
  frequency?: Frequency;
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

class Credit {
  name: string;
  value: number;
  dueDate: Date;
  isAlive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

class Mark {
  name: string;
  price: number;
  isAlive: boolean;
  commits: Commit[];
  conclusionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
} // tirar

class Commit {
  name: string;
  isPorcentage: boolean;
  value: number;
  isConstant: boolean;
  constancy?: Constancy;
  isAlive: boolean;
  origin: string;
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
