import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateChargingDto } from './dtos/create.charge.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fuel-logs')
  getLogs(){
    return this.appService.getAll();
  }
  @Post('fuel-logs')
  addCharging(@Body() dto: CreateChargingDto){
    return this.appService.create(dto);
  }
 @Delete('fuel-logs/:id')
deleteCharging(@Param('id') id: string) {
  return this.appService.delete(Number(id));
}

@Get('/dashboard/stats')
getMonthlySummary() {
  return this.appService.getMonthlySummary();
}


}
