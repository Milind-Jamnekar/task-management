import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      date: new Date(),
    });
    return this.taskRepository.save(task); // Save the task to the database
  }

  findAll() {
    return this.taskRepository.find({});
  }

  findOne(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.update(id, updateTaskDto);
    return this.findOne(id); // Return the updated task
  }

  async remove(id: number) {
    const deletedTask = await this.taskRepository.delete(id);
    return {
      message: `Task with ID ${id} has been removed`,
      data: deletedTask,
    };
  }
}
