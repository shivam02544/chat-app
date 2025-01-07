import { connectDb } from "@/helper/connectDB";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const createToken = (id) => {
  const token = jwt.sign({ id }, "IshuMeriJaanHain", {
    expiresIn: "1y",
  });
  return token;
};

export const GET = async (req) => {
  return NextResponse.json({ msg: "hello" });
};
export const POST = async (request) => {
  try {
    const body = await request.json();
    await connectDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
    const user = new Users(body);
    await user.save();
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
