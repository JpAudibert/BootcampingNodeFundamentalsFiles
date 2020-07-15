import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactionToBeDeleted = await transactionsRepository.findOne(id);

    if (!transactionToBeDeleted) {
      throw new AppError('Transaction not found.');
    }

    await transactionsRepository.delete(transactionToBeDeleted.id);
  }
}

export default DeleteTransactionService;
