import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = ClerkExpressWithAuth({
  onError: (err, req, res, next) => {
    console.error("Clerk auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  },
});
