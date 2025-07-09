import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionLog } from '../entities/transaction_log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionLogService {
  constructor(
    @InjectRepository(TransactionLog)
    private readonly transactionLogRepo: Repository<TransactionLog>,
  ) {}

  async create(data: any): Promise<void> {
    console.log('🚀 ~ TransactionLogService ~ create ~ data:', data);
    try {
      return await this.transactionLogRepo.save(data);
    } catch (error) {
      console.log('🚀 ~ TransactionLogService ~ create ~ error:', error);
      throw new Error(`Failed to log transaction: ${error.message}`);
    }
  }
}
