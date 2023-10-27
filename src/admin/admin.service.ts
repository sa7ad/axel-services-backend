import { Inject, Injectable, Res } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Servicer } from 'src/servicer/entities/servicer.entity';
import mongoose, { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import * as otpGenerator from 'otp-generator';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/admin-category.entity';
import { CategoryAdminDto } from './dto/admin-category.dto';
import { bookingDto } from 'src/users/dto/create-user.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AdminService {
  constructor(
    @Inject('SERVICER_MODEL')
    private servicerModel: Model<Servicer>,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('CATEGORY_MODEL')
    private categoryModel: Model<Category>,
    @Inject('BOOKING_MODEL')
    private bookingModel: Model<bookingDto>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  async adminLogin(createAdminDto: CreateAdminDto, @Res() res: Response) {
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
      const adminPass = this.configService.get<string>('ADMIN_PASS');
      const adminId = this.configService.get<string>('ADMIN_ID');
      const { email, password } = createAdminDto;
      if (adminEmail === email) {
        if (adminPass === password) {
          const payload = { _id: adminId };
          res.status(200).json({
            access_token: await this.jwtService.sign(payload),
            message: 'Successfully Logged In',
          });
        } else {
          res.status(400).json({ message: 'Admin password is incorrect' });
        }
      } else {
        res.status(400).json({ message: 'Admin email is incorrect' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async approveServicer(id: string, @Res() res: Response) {
    try {
      const findApproved = await this.servicerModel.findById({ _id: id });
      if (findApproved['isApproved'] === true) {
        await this.servicerModel.updateOne(
          { _id: id },
          { $set: { isApproved: false } },
        );
        return res.status(201).json({ message: 'Success' });
      }
      await this.servicerModel.updateOne(
        { _id: id },
        { $set: { isApproved: true } },
      );
      const servicerEmail = await this.servicerModel.findById({ _id: id });
      if (servicerEmail['isApproved'] === true) {
        const otp = await otpGenerator.generate(4, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        await this.mailerService.sendMail({
          to: `${servicerEmail['email']}`,
          from: process.env.DEV_MAIL,
          subject: 'Axel Services Email Verification',
          text: 'Axel Services',
          html: `<h1>Welcome Servicer, Please enter the OTP to move Further! <b>${otp}</b> </h1>`,
        });
        const altCode = await this.servicerModel.updateOne(
          { _id: id },
          { $set: { altCode: otp } },
        );
        return res.status(201).json({ message: 'Success', altCode: altCode });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async servicersApproval(@Res() res: Response) {
    try {
      const servicesFind = await this.servicerModel.find({});
      return res
        .status(200)
        .json({ message: 'Success', approvals: servicesFind });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async cancelApproval(id: string, @Res() res: Response) {
    try {
      const servicesApproved = await this.servicerModel.updateOne(
        { _id: id },
        { $set: { isApproved: false } },
      );
      return res
        .status(201)
        .json({ message: 'Success', approvals: servicesApproved });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async userMgt(@Res() res: Response) {
    try {
      const users = await this.userModel.find({});
      res.status(200).json({ message: 'Success', users: users });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async blockUnblockUser(@Res() res: Response, id: string) {
    try {
      const findBlock = await this.userModel.findById({ _id: id });
      if (findBlock['isBlocked'] === true) {
        await this.userModel.updateOne(
          { _id: id },
          { $set: { isBlocked: false } },
        );
        return res.status(200).json({ message: 'Success' });
      }
      await this.userModel.updateOne(
        { _id: id },
        { $set: { isBlocked: true } },
      );
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async addCategory(@Res() res: Response, category: CategoryAdminDto) {
    try {
      const { categoryName, description } = category;
      const newCategory = new this.categoryModel({
        categoryName: categoryName,
        description: description,
      });
      await newCategory.save();
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async listCategory(@Res() res: Response) {
    try {
      const listCategories = await this.categoryModel.find({});
      return res
        .status(200)
        .json({ message: 'Success', categories: listCategories });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async listBookings(@Res() res: Response) {
    try {
      const listBookings = await this.bookingModel.aggregate([
        {
          $lookup: {
            from: 'servicers',
            localField: 'service',
            foreignField: '_id',
            as: 'services',
          },
        },
        {
          $unwind: {
            path: '$services',
          },
        },
      ]);
      return res
        .status(200)
        .json({ message: 'Success', bookings: listBookings });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async logOut(@Res() res: Response) {
    try {
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async listUnlist(@Res() res: Response, id: string) {
    try {
      const listCheck = await this.categoryModel.find({ _id: id });
      if (listCheck[0]['list'] === true) {
        await this.categoryModel.updateOne(
          { _id: id },
          { $set: { list: false } },
        );
      } else {
        await this.categoryModel.updateOne(
          { _id: id },
          { $set: { list: true } },
        );
      }
      return res.status(201).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async cancelBooking(
    @Res() res: Response,
    textArea: string,
    bookingId: string,
    userId: string,
  ) {
    try {
      await this.bookingModel.updateOne(
        { _id: bookingId },
        { $set: { approvalStatus: 'Cancelled' } },
      );
      await this.userModel.updateOne(
        { _id: userId },
        {
          $push: {
            inbox: {
              cancelReason: textArea,
              bookingId: new mongoose.Types.ObjectId(bookingId),
            },
          },
        },
      );
      return res.status(201).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async listServices(@Res() res: Response) {
    try {
      const listServices = await this.servicerModel.find({});
      return res
        .status(200)
        .json({ message: 'Success', services: listServices });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async blockServicer(@Res() res: Response, id: string) {
    try {
      const findServicer = await this.servicerModel.findById({ _id: id });
      if (findServicer['isBlocked']) {
        await this.servicerModel.updateOne(
          { _id: id },
          { $set: { isBlocked: false } },
        );
      } else {
        await this.servicerModel.updateOne(
          { _id: id },
          { $set: { isBlocked: true } },
        );
      }
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async updateCategory(
    @Res() res: Response,
    id: string,
    categoryName: string,
    description: string,
  ) {
    try {
      await this.categoryModel.updateOne(
        { _id: id },
        { $set: { categoryName: categoryName, description: description } },
      );
      return res.status(201).json({ message: 'Success' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
