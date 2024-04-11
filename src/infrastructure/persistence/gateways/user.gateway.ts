import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserGateway {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload: User): Promise<UserDocument> {
    return this.userModel.create(payload);
  }

  async findOne(payload: Partial<User>): Promise<UserDocument> {
    return this.userModel.findOne(payload).exec();
  }

  async update(id: string, user: Partial<User>): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
