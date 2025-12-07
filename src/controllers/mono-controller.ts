import axios from "axios";
import MonoModel from "../models/mono-model";
const asyncHandler = require("express-async-handler");

if (!process.env.MONO_SECRET_KEY) {
  throw new Error("MONO_SECRET_KEY is missing");
}

const MONO_SECRET = process.env.MONO_SECRET_KEY;
const MONO_BASE = "https://api.withmono.com/v2";

// POST /api/v1/mono/exchange
export const exchangeCode = asyncHandler(async (req: any, res: any) => {
  try {
    const { code, userId } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "code is required" });
    }

    // Exchange the temporary token
    const response = await axios.post(
      `${MONO_BASE}/accounts/auth`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "mono-sec-key": MONO_SECRET,
        },
      }
    );

    const data = response.data?.data;
    const monoAccountId = data?.id;

    if (!monoAccountId) {
      return res
        .status(502)
        .json({ success: false, message: "Invalid Mono response" });
    }

    // Save account to DB
    await MonoModel.findOneAndUpdate(
      { monoAccountId },
      {
        monoAccountId,
        userId,
        institution: data?.meta?.data?.institution || "",
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Bank connected successfully",
      accountId: monoAccountId,
    });
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      success: false,
      message: "Token exchange failed",
      error: err.response?.data || err.message,
    });
  }
});

// GET /api/v1/mono/account/:id
export const getAccountDetails = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // lookup saved account
    const saved =
      (await MonoModel.findOne({ monoAccountId: id })) ||
      (await MonoModel.findById(id));

    if (!saved) {
      return res
        .status(404)
        .json({ success: false, message: "Mono account not found" });
    }

    // fetch live details from Mono
    const response = await axios.get(
      `${MONO_BASE}/accounts/${saved.monoAccountId}`,
      {
        headers: {
          accept: "application/json",
          "mono-sec-key": MONO_SECRET,
        },
      }
    );

    res.json({
      success: true,
      message: "Account details fetched",
      data: response.data?.data || response.data,
    });
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      success: false,
      message: "Failed to fetch account details",
      error: err.response?.data || err.message,
    });
  }
});

// GET /api/v1/mono/account/:id/transactions?page=1
export const getTransactions = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const page = req.query.page || 1;

    const saved =
      (await MonoModel.findOne({ monoAccountId: id })) ||
      (await MonoModel.findById(id));

    if (!saved) {
      return res
        .status(404)
        .json({ success: false, message: "Mono account not found" });
    }

    const response = await axios.get(
      `${MONO_BASE}/${saved.monoAccountId}/transactions?page=${page}`,
      {
        headers: {
          accept: "application/json",
          "mono-sec-key": MONO_SECRET,
        },
      }
    );

    res.json({
      success: true,
      message: "Transactions fetched",
      data: response.data?.data || [],
      meta: response.data?.meta || null,
    });
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.response?.data || err.message,
    });
  }
});

// DELETE /api/v1/mono/:id
export const deleteMonoAccount = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const acc =
      (await MonoModel.findById(id)) ||
      (await MonoModel.findOne({ monoAccountId: id }));

    if (!acc) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    await MonoModel.findByIdAndDelete(acc._id);

    res.json({
      success: true,
      message: "Mono account deleted",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
