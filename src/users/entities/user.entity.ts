import { Bank } from 'src/banks/entities/bank.entity';
import { Historic } from 'src/historics/entities/historic.entity';

export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  value?: number; // user nunca mexe nisso
  banks?: Bank[]; // user nunca mexe nisso
  marks?: Mark[]; // user nunca mexe nisso
  historics?: Historic[]; // user nunca mexe nisso
  createdAt?: Date;
  updatedAt?: Date;
}

class Constancy {
  from: string;
  date: Date;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
} //

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
