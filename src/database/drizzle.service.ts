import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {CONNECTION_POOL} from "./database.module-definition";
import {Inject, Injectable} from "@nestjs/common";
import * as databaseSchema from "./schema";

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof databaseSchema>;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.db = drizzle(this.pool, { schema: databaseSchema });
  }
}