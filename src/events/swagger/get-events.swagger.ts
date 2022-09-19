import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { EventDto } from '../dtos/event.dto';

export function GetEventsSwagger() {
    return applyDecorators(ApiOkResponse({ type: EventDto }));
}
