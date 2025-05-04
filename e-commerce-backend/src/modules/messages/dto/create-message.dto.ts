import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
