import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'Test Task',
        isDone: false,
      };
      const savedTask = { id: 1, ...createTaskDto, date: new Date() };

      mockTaskRepository.create.mockReturnValue(savedTask);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(createTaskDto);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        date: expect.any(Date),
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(savedTask);
      expect(result).toEqual(savedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];
      mockTaskRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(mockTaskRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const task = { id: 1, title: 'Task 1' };
      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne(1);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task and return the updated task', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const updatedTask = { id: 1, ...updateTaskDto };

      mockTaskRepository.update.mockResolvedValue({ affected: 1 });
      mockTaskRepository.findOne.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task and return a confirmation message', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Task with ID 1 has been removed',
        data: { affected: 1 },
      });
    });
  });
});
