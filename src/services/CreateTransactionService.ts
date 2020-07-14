import { getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

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
      category_id: checkCategory.id,
    });

    transactionRepository.save(newTransation);

    return newTransation;
  }
}

export default CreateTransactionService;
