import { connectDb } from "@/helper/connectDB";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const createToken = (id) => {
  const token = jwt.sign(id, "IshuMeriJaanHain", {
    expiresIn: "1y",
  });
  return token;
};

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  // console.log(getDeviceInfo(request));

  await connectDb();
  let user = await Users.findOne({ email });
  if (!user)
    return NextResponse.json(
      { message: "Email is not registered" },
      { status: 400 }
    );
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return NextResponse.json(
      { message: "Password is not valid" },
      { status: 400 }
    );

  const token = createToken({ id: user._id, userName: user.fullname });
  const response = NextResponse.json({
    message: "Logging in...",
    token,
  });
  response.cookies.set("token", token, {
    expiresIn: "1d",
    httpOnly: true,
  });
  return response;
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
