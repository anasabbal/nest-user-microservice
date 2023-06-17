import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';


function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.password;
}

export interface IUserSchema extends mongoose.Document{
  email: string;
  password: string;
  is_confirmed: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  getEncryptedPassword: (password: string) => Promise<string>;
}

export const UserSchema = new mongoose.Schema<IUserSchema>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true
    },
    email: {
      type: String,
      required: [true, 'Email can not be empty'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },
    is_confirmed: {
      type: Boolean,
      required: [true, 'Confirmed can not be empty'],
    },
    password: {
      type: String,
      required: [true, 'Password can not be empty'],
      minlength: [6, 'Password should include at least 6 chars'],
    },
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  },
);
// Hash the password before saving the user
UserSchema.pre('save', async function(next) {
  const user = this;
  if(!user.isModified('password'))
    return next();
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});

// Check if the password is correct
UserSchema.methods.comparePassword = async function(password: string){
  return bcrypt.compare(password, this.password);
}