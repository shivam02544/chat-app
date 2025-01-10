import { connectDb } from "@/helper/connectDB";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const type = searchParams.get("type");
    await connectDb();
    const user = await Users.findOne({ email: email });
    if (type == "signup") {
      if (user) {
        return NextResponse.json(
          {
            message: "Email is already registered.",
          },
          { status: 409 }
        );
      }
    } else {
      if (!user) {
        return NextResponse.json(
          {
            message: "Email is not registered.",
          },
          { status: 404 }
        );
      }
    }

    const otp = generateOtp();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anteshkumar114@gmail.com",
        pass: "twmyfauxoxowfnjo",
      },
    });
    const mailOptions = {
      from: "anteshkumar114@gmail.com",
      to: email,
      subject: "Verification OTP",
      text: `Your verification OTP is: ${otp}`,
      html: `<div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center;">
              <h2 style="color: #333; margin-bottom: 20px;">Verification OTP</h2>
              <p style="font-size: 18px; color: #666;">Your verification OTP is: <strong style="color: #007bff;">${otp}</strong></p>
              <p style="font-size: 14px; color: #999;">This OTP is valid for a limited time. Please enter it in the app to verify your account.</p>
            </div>`,
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      message: "Otp Sent on your email address",
      otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
