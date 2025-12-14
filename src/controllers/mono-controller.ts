import axios from "axios";
import MonoModel from "../models/mono-model";
import asyncHandler from "express-async-handler";

const MONO_SECRET = process.env.MONO_SECRET_KEY!;
const MONO_BASE = "https://api.withmono.com/v2";

// -------------------- EXCHANGE CODE --------------------
export const exchangeCode = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const { code } = req.body;

  /* ---------------- VALIDATION ---------------- */
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Mono auth code is required",
    });
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Step 1: Check if user already has a Mono customer
  let exchangeResponse;

  try {
    exchangeResponse = await axios.post(
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
  } catch (err: any) {
    console.error("Mono exchange error:", err.response?.data);

    return res.status(400).json({
      success: false,
      message: err.response?.data?.message || "Mono exchange failed",
    });
  }

  const monoData = exchangeResponse.data?.data;

  console.log("MONO AUTH RESPONSE:", monoData);

  /* ---------------- EXTRACT SAFELY ---------------- */
  const monoAccountId = monoData?.id;

  if (!monoAccountId) {
    return res.status(502).json({
      success: false,
      message: "Mono account ID missing",
    });
  }

  const monoCustomerId = monoData?.customer?.id || monoData?.customer || null;

  /* ---------------- SAVE ACCOUNT ---------------- */
  const savedAccount = await MonoModel.findOneAndUpdate(
    { monoAccountId },
    {
      monoAccountId,
      monoCustomerId,
      userId,
      institution: monoData?.meta?.data?.institution || "",
    },
    { new: true, upsert: true }
  );

  /* ---------------- SUCCESS ---------------- */
  return res.status(200).json({
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
