import { IsEmail, IsString, IsNumber, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty()
    @IsNumber()
    eventId: number;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    firstName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    lastName: string;

    @ApiProperty()
    @IsString()
    @Matches(
        /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/,
        {
            message: 'invalid dateTime. It should be "YYYY-MM-DD HH:MM:SS"',
        },
    )
    selectedDateTime: string;
}
