//controllers are the actual code

import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; //token would be valid for 3days
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
//whenever we signup what should happen is written here
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required.");
    }
    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required.");
    }

    const user = await User.findOne({ email }); //password would be encrypted automatically
    
    if (!user) {
      return response.status(404).send("User with the given email not found.");
    }
    
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send("Password is incorrect.");
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User with the given id not found.");
    }

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName) {
      return response
        .status(404)
        .send("Firstname lastname and color is required.");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );
    //new : true tells the mongodb query to return the new data so that we can send it to the frontend
    //to run validators in out data runvalidators
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      image: updatedUser.image,
    });
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found.");
    }
    if (user.image) {
      unlinkSync(user.image);
    } //use unlinkSync to delete the image
    user.image = null;
    await user.save(); //save user object its  a mongoose method

    return response.status(200).send("Profile image removed sucessfully.");
    //201 denotes the user has been created and the jason value
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
export const logout = async (request, response, next) => {
  try {
   
    response.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});//empty cookie expires after 1 sec
    return response.status(200).send("Logout successfull.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
