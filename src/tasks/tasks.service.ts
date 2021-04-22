import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'node:process';
import { User } from 'src/auth/user.entity';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {

    }

    async getAllTasks(
        filterDto: GetTasksFilterDto, user: User
    ): Promise<Task[]> {
        return await this.taskRepository.getAllTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: { id, 'userId': user.id }
        });
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found`)
        }
        return found;
    }


    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`)
        }
    }
    async updateTaskStatus(
        id: number,
        taskStatus: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = taskStatus;
        await task.save();
        return task;
    }
}
