import { Injectable } from '@nestjs/common';
import  { PrismaService } from './prisma.service';
import  { CreateChargingDto } from './dtos/create.charge.dto';


export interface Charging {
  id: number;
  type: string;
  liters: number;
  pricePerLiter: number;
  total: number;
  date: Date;
  createdAt: Date;
}

@Injectable()
export class AppService {

  constructor(private readonly prisma:PrismaService){}

  getAll(): Promise<Charging[]> {
  return this.prisma.charging.findMany();

  
}

create(data: CreateChargingDto) {
  const total = data.liters * data.pricePerLiter;
    return this.prisma.charging.create({
      data: {
        ...data,
        date: new Date(data.date),
        total,
      }
    });
  }

  async delete(id: number) {
  return this.prisma.charging.delete({
    where: { id },
  });
}
async getMonthlySummary() {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const records = await this.prisma.charging.findMany({
    where: {
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  const totalSpent = records.reduce((acc, r) => acc + r.total, 0);
  const totalLiters = records.reduce((acc, r) => acc + r.liters, 0);
  const avgPrice = totalLiters > 0 ? totalSpent / totalLiters : 0;

  // projeção corrigida — baseada em litros/dia, não em gasto/dia
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  let projectedTotal = 0;

  if (today > 1 && totalLiters > 0) {
    const avgLitersPerDay = totalLiters / today;
    const projectedLiters = avgLitersPerDay * daysInMonth;
    projectedTotal = projectedLiters * avgPrice; // volta pra R$
  }

  const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });

  return {
    totalSpent,
    totalLiters,
    avgPrice,
    projectedTotal,
    monthName,
  };
}


}
