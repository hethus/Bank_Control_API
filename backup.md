type Frequency {
  time             String
  isAlive          Boolean  @default(true)
}

type constancy {
  from            String // mes especifico, valor especifico ou valor padrao (ate a data final da mark)
  date            DateTime?
  value           Float?
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @default(now()) @map("updated_at")
}

model User {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  name             String
  email            String   @unique
  password         String
  banks            Bank[]
  currencys        Currency[]
  credits          Credit[]
  marks            Mark[]
  debts            Debt[]
  historics        Historic[]
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")

  @@map("users")
}

model Bank {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  name             String   @unique
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  credit           Credit?
  currency         Currency[]
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")

  @@map("banks")
}

model Currency {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  bank             Bank     @relation(fields: [bankName], references: [name])
  bankName         String                          @map("bank_name")
  name             String   @unique
  value            Float
  isFrequent       Boolean  @default(false)        @map("is_frequent")
  frequency        Frequency?
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")

  @@map("currencies")
}

model Credit {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  bank             Bank    @relation(fields: [bankName], references: [name])
  bankName         String   @unique                @map("bank_name")
  value            Float
  dueDate          DateTime
  isAlive          Boolean  @default(true)
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")

  @@map("credits")
}

model Mark {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  name             String   @unique
  value            Float
  isAlive          Boolean  @default(true)         @map("is_alive") //se estiver false, e for para true, devera ser feito update
  commits          Commit[]
  conclusionDate   DateTime?                       @map("conclusion_date")
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")

  @@map("marks")
}

model Commit {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  mark             Mark     @relation(fields: [markName], references: [name])
  markName         String   @map("mark_name")
  name             String
  isPorcentage     Boolean  @default(false)        @map("is_porcentage")
  price            Float // se isPorcentage for true, price é em porcentagem
  isConstant       Boolean  @default(false)        @map("is_frequent")
  constancy        constancy?
  isAlive          Boolean  @default(true)         @map("is_alive")
  origin           String // pode ser o nome de um Currency ou de um Bank / Credit
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")
}

model Debt {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  name             String   @unique
  value            Float
  isAlive          Boolean  @default(true)         @map("is_alive")
  isCredit         Boolean  @default(false)        @map("is_credit")
  isFrequent       Boolean  @default(false)        @map("is_frequent")
  frequency        Frequency?
  origin           String // pode ser o nome de um Currency ou de um Bank / Credit
  createdAt        DateTime @default(now())        @map("created_at")
  updatedAt        DateTime @default(now())        @map("updated_at")
}

model Historic {
  id               String   @id @default(auto())   @map("_id") @db.ObjectId
  user             User     @relation(fields: [userEmail], references: [email])
  userEmail        String
  name             String
  value            Float
  operation        String // se é debt, credit, mark, bank
  isAlive          Boolean  @default(true)         @map("is_alive")
  isCredit         Boolean  @default(false)        @map("is_credit")
  origin           String // pode ser o nome de um Currency ou de um Bank / Credit
  isFrequent       Boolean  @default(false)        @map("is_frequent")
  frequency        Frequency?
  createdAt        DateTime @default(now())        @map("created_at")
}

//

type Historic {
  name             String
  value            Float
  operation        String // se é debt, credit, mark, bank
  isAlive          Boolean  @default(true)         @map("is_alive")
  isCredit         Boolean  @default(false)        @map("is_credit")
  origin           String // pode ser o nome de um Currency ou de um Bank / Credit
  isFrequent       Boolean?  @default(false)        @map("is_frequent")
  frequency        Frequency?
  isPorcentage     Boolean?  @default(false)        @map("is_porcentage")
  isConstant       Boolean?  @default(false)        @map("is_constant")
  constancy        constancy?
  createdAt        DateTime @default(now())        @map("created_at")
}
