/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseInterceptors,
  Query,
  UploadedFile,
  ValidationPipe,
  UsePipes,
  Req,
} from '@nestjs/common';
import { ServicerService } from './servicer.service';
import {
  CreateServicerDto,
  LoginServicerDto,
  servicerProcedures,
} from './dto/create-servicer.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('servicer')
export class ServicerController {
  constructor(private readonly servicerService: ServicerService) {}
  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicerRegister(
    @Body() createServicerDto: CreateServicerDto,
    @Res() res: Response,
  ) {
    try {
      return this.servicerService.servicerRegister(createServicerDto, res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Post('servicerProcedures')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file'))
  async servicerProcedures(
    @Body() servicerProcedures: servicerProcedures,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('id') id: string,
  ) {
    try {
      return this.servicerService.servicerProcedures(
        servicerProcedures,
        res,
        file,
        id,
      );
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicerLogin(
    @Body() loggedServicer: LoginServicerDto,
    @Res() res: Response,
  ) {
    try {
      return this.servicerService.servicerLogin(loggedServicer, res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('servicerList')
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicerDashboard(@Res() res: Response) {
    try {
      return this.servicerService.servicerDashboard(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('servicerDetails')
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicerDetails(@Res() res: Response, @Query('id') id: string) {
    try {
      return this.servicerService.servicerDetails(res, id);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('servicersApproval')
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicersApproval(@Res() res: Response) {
    try {
      return this.servicerService.servicersApproval(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('servicerOtpVerification')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendMail(@Res() res: Response, @Query('id') id: string) {
    try {
      return this.servicerService.sendMail(res, id);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Post('servicerDashboard')
  @UsePipes(new ValidationPipe({ transform: true }))
  async loadDashboard(@Res() res: Response, @Body('id') id: string) {
    try {
      return this.servicerService.loadDashboard(res, id);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('categoriesList')
  @UsePipes(new ValidationPipe({ transform: true }))
  async servicesList(@Res() res: Response) {
    try {
      return this.servicerService.categoriesList(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('logOut')
  @UsePipes(new ValidationPipe({ transform: true }))
  async logOut(@Res() res: Response) {
    try {
      return this.servicerService.logOut(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('listBookings')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listBookings(@Res() res: Response) {
    try {
      return this.servicerService.listBookings(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Post('approveBooking')
  @UsePipes(new ValidationPipe({ transform: true }))
  async approveBooking(@Res() res: Response, @Body('id') id: string) {
    try {
      return this.servicerService.approveBooking(res, id);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Post('cancelBooking')
  @UsePipes(new ValidationPipe({ transform: true }))
  async scancelBooking(
    @Res() res: Response,
    @Body('textArea') textArea: string,
    @Body('bookingId') bookingId: string,
    @Body('userId') userId: string,
  ) {
    try {
      return this.servicerService.cancelBooking(
        res,
        textArea,
        bookingId,
        userId,
      );
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('getRecentUsers')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecentUsers(@Req() req: Request, @Res() res: Response) {
    try {
      return this.servicerService.getRecentUsers(res, req);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('getRecentChats')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecentChats(
    @Query('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      return this.servicerService.getRecentChats(id, res, req);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
  @Get('dashboardReports')
  @UsePipes(new ValidationPipe({ transform: true }))
  async dashboardReports(@Res() res: Response) {
    try {
      return this.servicerService.dashboardReports(res);
    } catch (error) {
      const { message } = error;
      if (res.status(500)) {
        return res.status(500).json({ message: message });
      } else {
        return res.status(400).json({ message: message });
      }
    }
  }
}
