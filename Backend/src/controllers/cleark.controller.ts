import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const clearkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);
    // Getting Data from request
    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            id: data.id,
            email: data?.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });

        break;
      }

      case "user.updated": {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            id: data.id,
            email: data?.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          },
        });

        break;
      }

      case "user.deleted": {
        await prisma.user.delete({
          where: {
            id: data.id,
          },
        });

        break;
      }

      case "paymentAttempt.updated": {
        if((data.charge_type === "recurring" || data.charge_type === "checkout") && data.status === "paid") {
            const credits = {pro: 100, premium: 300};
            const clerkUserId = data?.payer?.user_id;
            const planId = data?.subscription_items?.[0]?.plan?.slug as keyof typeof credits;

            if(planId !== "pro" && planId !== "premium") {
                return res.status(400).json({ message: "Invalid plan" });
            }

            console.log(planId, clerkUserId);
            await prisma.user.update({
                where: { id: clerkUserId },
                data: { credits: { increment: credits[planId] } }
            })
        }
      }

      default:
        break;
    }

    res.status(200).json({ message: "Webhook received: " + type });
  } catch (error: any) {
    res.status(500).json({ message: "Error processing webhook", error: error.message });
  }
};

export default clearkWebhook;