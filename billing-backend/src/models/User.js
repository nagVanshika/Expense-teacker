const mongoose = require("mongoose");

const user = new mongoose.Schema({
  user_id: {
    type: String
  },
  name: String,
  mobile_number: {
    type: Number
  },
  email: {
    type: String
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  cars: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car"
      },
      car_name: String,
      car_type: String,
      status: String,
      primary: Boolean,
      vehicle_number: String,
      registration_numbers: [String]
    }
  ],
  status: String,
  is_verified: Boolean,
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking"
  }],
  cart: [
    {
      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car"
      },
      userVehicleId: {
        type: String // To identify the specific user car subdocument
      },
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service"
      },
      quantity: {
        type: Number,
        default: 1
      },
      addOns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "service"
      }],
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service"
    }
  ],
  wallet: Number,
  total_earned: Number,
  total_redeemed: Number,
  total_water_saving: Number,
  total_water_saved: { type: Number, default: 0 },
  coupon: [
    {
      coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupon_code"
      },
      coupon_code: String,
      used: Boolean,
    }
  ],
  pincode: Number,
  user_address: [{
    tag: String,
    address: String,
    primary: Boolean,
    pincode: Number,
    latitude: String,
    longitude: String,
    flat: String,
    floor: String,
    landmark: String,
    name: String,
    city: String,
    status: {
      type: String,
      default: "active"    // takees 2 "active" and "deleted"
    }
  },
  ],
  contact: [],
  location_address: String,
  notification_token: String,
  os: String,
  app_version: String,
  lastNewsFetchTime: {
    type: Date,
    default: null
  },
  last_login: String,
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // sparse allows nulls but keeps it unique if present
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: null,
  },
  hasCompletedFirstBooking: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })


exports.User = mongoose.model("user", user)