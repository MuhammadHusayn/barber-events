import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { applyDecorators } from '@nestjs/common';

export function PostBookingSwagger() {
    class BookingResponse extends CreateBookingDto {
        @ApiProperty({
            type: Number,
        })
        id: number;
    }

    return applyDecorators(ApiCreatedResponse({ type: BookingResponse }));
}
