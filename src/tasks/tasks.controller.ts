import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './../auth/user.entity';
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getAllTasks(filterDto, user);
    }


    @Get('/:id')
    getTaskById(@Param(
        'id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {

        return this.tasksService.getTaskById(id, user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @GetUser() user: User,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<Task> {

        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user:User,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status,user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user:User
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id,user);
    }



}
