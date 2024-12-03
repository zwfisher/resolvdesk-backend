import { DrizzleService } from '../drizzle.service';
import { Test } from '@nestjs/testing';
import { User, users } from '../schema';
import { AppModule } from '../../app.module';

describe('DrizzleService', () => {
  let drizzleService: DrizzleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    drizzleService = moduleRef.get(DrizzleService);
    await drizzleService.cleanup();
  });

  it('should be defined', () => {
    expect(drizzleService).toBeDefined();
  });

  describe('cleanup()', () => {
    it('should clean all users', async () => {
      const inserted: User[] = await drizzleService.db
        .insert(users)
        .values({
          email: 'uniqueuser@gmail.com',
          name: 'Unique User',
          password: 'hashed',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      expect(inserted).toHaveLength(1);

      await drizzleService.cleanup();

      const result = await drizzleService.db.select().from(users);
      expect(result).toHaveLength(0);
    });
  });
});
