/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ServicerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    category: { type: mongoose.Schema.ObjectId, ref: 'CATEGORY_MODEL' },
    serviceName: String,
    description: String,
    amount: Number,
    image: String,
    address: Object,
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    alternateKey: String,
});