import axios from "axios";
import MonoModel from "../models/mono-model";
import asyncHandler from "express-async-handler";

if (!process.env.MONO_SECRET_KEY) {
  throw new Error("MONO_SECRET_KEY is missing");
}

const MONO_SECRET = process.env.MONO_SECRET_KEY;
const MONO_BASE = "https://api.withmono.com/v2";

// -------------------- EXCHANGE CODE --------------------
export const exchangeCode = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const { code } = req.body;
  if (!code || !userId) {
    res.status(400);
    throw new Error("code and userId are required");
  }

  // Step 1: Check if user already has a Mono customer
  let account = await MonoModel.findOne({ userId });

  if (!account?.monoCustomerId) {
    const customerResponse = await axios.post(
      `${MONO_BASE}/customers`,
      { name: "User " + userId },
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
      res.status(502);
      throw new Error("Failed to create Mono customer");
    }

    account = await MonoModel.findOneAndUpdate(
      { userId },
      { monoCustomerId: customer.id, userId },
      { new: true, upsert: true }
    );
  }

  // Step 2: Exchange the code for Mono account
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
    res.status(502);
    throw new Error("Invalid Mono response during code exchange");
  }

  // Step 3: Save Mono account info
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
});

// -------------------- GET OR CREATE CUSTOMER --------------------
export const getOrCreateCustomer = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }

  const existing = await MonoModel.findOne({ userId });
  if (existing?.monoCustomerId) {
    return res.json({ success: true, customerId: existing.monoCustomerId });
  }

  const response = await axios.post(
    `${MONO_BASE}/customers`,
    { name: "User " + userId },
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
    res.status(502);
    throw new Error("Failed to create Mono customer");
  }

  await MonoModel.findOneAndUpdate(
    { userId },
    { monoCustomerId: customer.id, userId },
    { upsert: true, new: true }
  );

  res.json({ success: true, customerId: customer.id });
});

// -------------------- GET ACCOUNT DETAILS --------------------
export const getAccountDetails = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const saved =
    (await MonoModel.findOne({ monoAccountId: id })) ||
    (await MonoModel.findById(id));

  if (!saved) {
    res.status(404);
    throw new Error("Mono account not found");
  }

  const response = await axios.get(
    `${MONO_BASE}/accounts/${saved.monoAccountId}`,
    {
      headers: { accept: "application/json", "mono-sec-key": MONO_SECRET },
    }
  );

  res.json({
    success: true,
    message: "Account details fetched",
    data: response.data?.data || response.data,
  });
});

// -------------------- GET TRANSACTIONS --------------------
export const getTransactions = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const page = req.query.page || 1;

  const saved =
    (await MonoModel.findOne({ monoAccountId: id })) ||
    (await MonoModel.findById(id));

  if (!saved) {
    res.status(404);
    throw new Error("Mono account not found");
  }

  const response = await axios.get(
    `${MONO_BASE}/${saved.monoAccountId}/transactions?page=${page}`,
    { headers: { accept: "application/json", "mono-sec-key": MONO_SECRET } }
  );

  res.json({
    success: true,
    message: "Transactions fetched",
    data: response.data?.data || [],
    meta: response.data?.meta || null,
  });
});

// -------------------- DELETE MONO ACCOUNT --------------------
export const deleteMonoAccount = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const acc =
    (await MonoModel.findById(id)) ||
    (await MonoModel.findOne({ monoAccountId: id }));

  if (!acc) {
    res.status(404);
    throw new Error("Account not found");
  }

  await MonoModel.findByIdAndDelete(acc._id);

  res.json({
    success: true,
    message: "Mono account deleted",
  });
});
