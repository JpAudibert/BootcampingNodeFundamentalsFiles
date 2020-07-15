import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface NewTransactionRequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: NewTransactionRequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (balance.total - value < 0 && type === 'outcome') {
      throw new AppError('The value must be greater than your total balance');
    }

    if (value < 0) {
      throw new AppError('The value must be positive');
    }

    let checkCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategory) {
      checkCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(checkCategory);
    }

    const newTransation = transactionRepository.create({
      title,
      value,
      type,
      category: checkCategory,
    });

    await transactionRepository.save(newTransation);

    return newTransation;
  }
}

export default CreateTransactionService;
