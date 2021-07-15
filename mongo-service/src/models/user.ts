import mongoose, { model, Schema, Model, Document, UpdateQuery } from "mongoose";
import {comparePassword, encryptPassword} from '../tools/hashPassword';

interface IUser extends Document {
  id?: mongoose.Types.ObjectId,
  email: string;
  name: string;
  userName: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, trim: true, unique: 1, sparse: true },
    userName: { type: String, trim: true, unique: 1, sparse: true },
    name: { type: String, required: true, maxlength: 25 },
    password: { type: mongoose.SchemaTypes.String, minlength: 8 },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function() {
	const user: IUser = <IUser>this;
	if (user.isModified("password") || user.isNew) {
		user.password = await encryptPassword(user.password);
	}
});

UserSchema.pre('findOneAndUpdate', async function (this: UpdateQuery<IUser>) {
  if(this._update.password) {
    this._update.password = await encryptPassword(this._update.password);
  }
});

const User: Model<IUser> = model("User", UserSchema);

export {User, IUser}