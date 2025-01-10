import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Users from "@/models/users";
import { connectDb } from "@/helper/connectDB";

export const PUT = async (request) => {
  try {
    await connectDb();
    const body = await request.json();
    const user = await Users.findOne({ email: body.email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    user.password = hashedPassword;
    user.save();
    return NextResponse.json(
      {
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
