import { model, Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

// const genCryptoHash = require('../utils/genCryptoHash');

interface User extends Document {
  name: string;
  email: string;
  joinedAt: Date;
  password?: string;
  passwordConfirm?: string;
  // Add the matchPassword method
  matchPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (this: User, el: string) {
        return el === this.password;
      },
      message: "Password didn't match!",
    },
  },
  // passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  // photo: {
  //     type: String
  // },
  // role: {
  //     type: String,
  //     enum: ['user', 'guide', 'lead-guide', 'admin'],
  //     default: 'user'
  // },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  // if password is not modified then go to next
  if (!this.isModified("password")) return next();

  // if password is modified
  this.password = await bcrypt.hash(this.password as string, 12);

  //after hashing the password simply delete the confirm password
  this.passwordConfirm = undefined;

  next();
});

// userSchema.pre('save', function(next) {
//     if(!(this.isModified('password'))) {
//         return next();
//     }

//     this.passwordChangedAt = Date.now();

//     next();
// });

// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//     if (this.passwordChangedAt) {
//       const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

//       return JWTTimestamp < changedTimestamp;
//     }
//     // False means NOT changed
//     return false;
// };

// userSchema.methods.createPasswordResetToken = function() {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken = genCryptoHash(resetToken);

//     console.log({ resetToken }, {encryptedOne: this.passwordResetToken});

//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

userSchema.methods.matchPassword = async function matchPassword(
  candidatePassword: string,
  userPassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, userPassword);
  return isMatch;
};

// userSchema.pre(/^find/, function(next) {
//     this.select('-password');
//     next();
// })

const User = model<User>("User", userSchema);

export default User;
