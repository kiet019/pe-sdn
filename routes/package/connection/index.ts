import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/SDN301MPE_SU23_SE162045DB");
    console.log("Đã kết nối tới MongoDB");
  } catch (error) {
    console.error("Lỗi kết nối tới MongoDB:", error);
  }
};

export default connectDB;

