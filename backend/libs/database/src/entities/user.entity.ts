import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ default: '', required: true })
  firstName: string;

  @Prop({ default: '', required: true })
  lastName: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ required: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ select: false })
  salt?: string;

  @Prop({ default: new Date() })
  createdAt!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
