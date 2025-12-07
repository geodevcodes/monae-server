const router = require("express").Router();
import {
  googleLoginUser,
  githubLoginUser,
} from "../controllers/auth-controller";

// google auth login
router.post("/google-login", googleLoginUser);

// github auth login
router.post("/github-login", githubLoginUser);

export default router;
