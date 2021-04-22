import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses: string[] = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    isAllowed(status: string): boolean {
        return this.allowedStatuses.indexOf(status.toUpperCase()) !== -1;
    }
    transform(value: any) {
        if (this.isAllowed(value)) {
            return value;
        }
        else {
            throw new BadRequestException(`status '${value}' is not valid`)
        }
    }
}