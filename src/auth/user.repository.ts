import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User>
{


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        const salt = await bcrypt.genSalt();
        const { username, password } = authCredentialsDto;
        const user = new User();
        //making sure username is unique
        const isUsernameTaken = await this.findOne({
            username
        });
        if (isUsernameTaken) {
            throw new ConflictException('Username already taken');
        }
        //saving the user
        else {
            user.username = username;
            user.password = await this.hashPassword(password, salt);
            user.salt = salt;
            await user.save();
        }

    }
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto):Promise<string> {
        const { username, password } = authCredentialsDto;
        let user = await this.findOne({ username });
        if (user && await user.validatePassword(password))
        {
            return user.username;
        }
        else{
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

}