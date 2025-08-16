import { clerkClient } from "@clerk/clerk-sdk-node";

export const adminOnly = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;

    const allowedAdmins = process.env.ADMIN_EMAILS.split(","); // comma separated list

    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("Admin auth failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
