import { Request, Response } from "express";
import _ from "lodash";
import { LeanDocument } from "mongoose";
import { User, IUser } from '../models/user';
import { comparePassword } from "../tools/hashPassword";
import { getUserDTO } from "../tools/helper";
import { validateEmail, validateMongoID } from "../tools/validation";

export const allusers = async (req: Request, res: Response) => {

  const users: LeanDocument<IUser[]> = await User.find({}).select({password: 0, __v: 0}).lean().exec();
  res.send(users);
};

export const getUserByIdentifier = async (req: Request, res: Response) => {
  try {
    const identifier: string = req.params.identifier;
    let user: LeanDocument<IUser>;
    if (validateMongoID(identifier)) {
      user = await User.findById(identifier).select({password: 0, __v: 0}).lean().exec();
    } else {
      let query: any = {};
      !!validateEmail(identifier) ? query.email = identifier : query.userName = identifier;
      user = await User.findOne(query).select({password: 0, __v: 0}).lean().exec();
    }
  
    !!!user ? res.status(404).send("user cant find") : res.send(user);
  } catch (error) {
    res.status(400).send("There is problem in fetch the data");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    if (validateMongoID(id)) {
      const user: LeanDocument<IUser> = await User.findOneAndDelete({_id: id}).select({password: 0, __v: 0}).lean().exec();
       return !!user ? res.send(user) : res.status(404).send(`user with id: ${id} cant find`);
    }
  } catch (error) {
    res.status(400).send("There is problem in delete user");
  }
  res.status(405).send("the id isnt valid");
};

export const updateUser = async (req: Request, res: Response) => {
  const updateValue: Partial<IUser> = _.pick(req.body, ['password', 'userName', 'email', 'name']); 
    try {
      const userUpdate: LeanDocument<IUser> = await User.findOneAndUpdate({_id: req.params.id}, updateValue, {new: true, lean: true});
      res.send(...getUserDTO([userUpdate]))
    } catch (error) {
      res.status(404).send(`user with id: ${req.params.id} cant find`);
    }

   
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, userName, password } = req.body as Partial<IUser>;
  try {
    const user: LeanDocument<IUser> = await User.findOne({ ...(email) && { email }, ...(userName) && { userName } }).select({__v: 0}).lean().exec();
    const isRightPassword: Boolean = await comparePassword(password, user.password);
    if (isRightPassword) {
      res.status(200).send(...getUserDTO([user]));
    } else {
      throw { message: "password is incorrect" };
    }

  } catch (error) {
    res.status(403).send("username or password isn't valid");
  }
};

export let addUser = async (req: Request, res: Response) => {
  let user = new User(req.body);
  try {
    const newUser: IUser = await user.save();
    res.send(...getUserDTO([newUser.toJSON()]));
  } catch (error) {
    res.status(400).send(error);
  }
};