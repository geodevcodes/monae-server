import axios from "axios";
import MonoModel from "../models/mono-model";
import asyncHandler from "express-async-handler";

if (!process.env.MONO_SECRET_KEY) {
  throw new Error("MONO_SECRET_KEY is missing");
}

const MONO_SECRET = process.env.MONO_SECRET_KEY;
const MONO_BASE = "https://api.withmono.com/v2";

// POST /api/v1/mono/exchange
export const exchangeCode = asyncHandler(async (req: any, res: any) => {
  const { code, userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({
      success: false,
      message: "code and userId are required",
    });
  }

  try {
    // Step 1: Check if user already has a Mono customer
    let account = await MonoModel.findOne({ userId });

    if (!account?.monoCustomerId) {
      // Step 2: Create a new Mono customer if it doesn’t exist
      const customerResponse = await axios.post(
        `${MONO_BASE}/customers`,
        { name: "User " + userId }, // customize with user info
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "mono-sec-key": MONO_SECRET,
          },
        }
      );

      const customer = customerResponse.data?.data;

      if (!customer?.id) {
        return res.status(502).json({
          success: false,
          message: "Failed to create Mono customer",
        });
      }

      // Save customer in DB
      account = await MonoModel.findOneAndUpdate(
        { userId },
        { monoCustomerId: customer.id, userId },
        { new: true, upsert: true }
      );
    }

    // Step 3: Exchange the code for Mono account
    const exchangeResponse = await axios.post(
      `${MONO_BASE}/accounts/auth`,
      { code },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "mono-sec-key": MONO_SECRET,
        },
      }
    );

    const data = exchangeResponse.data?.data;

    const monoAccountId = data?.id;
    const monoCustomerId = data?.customer?.id;

    if (!monoAccountId || !monoCustomerId) {
      return res.status(502).json({
        success: false,
        message: "Invalid Mono response during code exchange",
      });
    }

    // Step 4: Save Mono account info
    const savedAccount = await MonoModel.findOneAndUpdate(
      { monoAccountId },
      {
        monoAccountId,
        monoCustomerId,
        userId,
        institution: data?.meta?.data?.institution || "",
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Bank connected successfully",
      account: savedAccount,
    });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      message: "Token exchange failed",
      error: err.response?.data || err.message,
    });
  }
});

// GET /api/v1/mono/customer/:userId
export const getOrCreateCustomer = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    // Check if user already has a Mono customer
    const existing = await MonoModel.findOne({ userId });

    if (existing && existing.monoCustomerId) {
      return res.json({ success: true, customerId: existing.monoCustomerId });
    }

    // Create a new Mono customer using their API
    const response = await axios.post(
      `${MONO_BASE}/customers`,
      { name: "User " + userId }, // You can customize this with actual user data
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "mono-sec-key": MONO_SECRET,
        },
      }
    );

    const customer = response.data?.data;

    if (!customer?.id) {
      return res
        .status(502)
        .json({ success: false, message: "Failed to create Mono customer" });
    }

    // Save in DB
    await MonoModel.findOneAndUpdate(
      { userId },
      { monoCustomerId: customer.id, userId },
      { upsert: true, new: true }
    );

    res.json({ success: true, customerId: customer.id });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      message: "Failed to fetch or create Mono customer",
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
