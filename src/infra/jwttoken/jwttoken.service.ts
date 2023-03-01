import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtTokenService } from './interface/jwttoken.interface';

@Injectable()
export class JwttokenService implements IJwtTokenService {

    private readonly logger = new Logger(JwttokenService.name);
    
    constructor(private jwtService: JwtService){}

    sign(obj: Object, expiresIn: string | number) {
        try{
            return this.jwtService.sign(obj, {expiresIn})
        }
        catch(err){
            this.logger.warn(`sign - Erro ao criar o token`);
            throw new InternalServerErrorException(`Erro ao criar o token`)
        }
    }
    decode(token: string) {
        try{
            return this.jwtService.decode(token);
        }
        catch(err){
            this.logger.warn(`decode - Erro ao decodificar token`);
            throw new InternalServerErrorException(`Erro ao decodificar token`)
        }
    }
    verify(token: string) {
        try{
            return this.jwtService.verify(token);
        }
        catch(err){
            this.logger.warn(`verify - Erro ao verificar token`);
            throw new InternalServerErrorException(`Erro ao verificar token`)
        }
    }
}
