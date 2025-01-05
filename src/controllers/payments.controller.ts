import { payments } from "@prisma/client";
import db from "../db";
import { format, addDays, subDays, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ENV } from "../config";

export const checkPaymentsAndSendMessages = async () => {
  try {
    const timeZone = "America/Bogota";
    const nowInBogota = toZonedTime(new Date(), timeZone);
    const today = format(nowInBogota, "dd/MM/yyyy");

    const activeClients = await db.clients.findMany({
      where: {
        status: "A",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        plate: true,
        payments: {
          where: {
            active: true,
            paid: false,
          },
        },
      },
    });

    for (const client of activeClients) {
      if (client.payments.length === 0) continue;

      const payment = client.payments[0];
      const dueDate = parse(payment.dueDate, "dd/MM/yyyy", new Date());
      const todayDate = parse(today, "dd/MM/yyyy", new Date());

      const dueDateBogota = toZonedTime(dueDate, timeZone);
      const todayBogota = toZonedTime(todayDate, timeZone);

      const threeDaysBefore = format(subDays(dueDateBogota, 3), "dd/MM/yyyy");
      const dueDay = format(dueDateBogota, "dd/MM/yyyy");
      const threeDaysAfter = format(addDays(dueDateBogota, 3), "dd/MM/yyyy");
      const sixDaysAfter = format(addDays(dueDateBogota, 6), "dd/MM/yyyy");
      const nineDaysAfter = format(addDays(dueDateBogota, 9), "dd/MM/yyyy");
      const currentDay = format(todayBogota, "dd/MM/yyyy");

      if (
        currentDay === threeDaysBefore &&
        !payment.sentMessages.includes(-3)
      ) {
        addToPending(client, payment, -3);
        await updatePaymentStatus(payment, -3);
      } else if (currentDay === dueDay && !payment.sentMessages.includes(0)) {
        addToPending(client, payment, 0);
        await updatePaymentStatus(payment, 0);
      } else if (
        currentDay === threeDaysAfter &&
        !payment.sentMessages.includes(3)
      ) {
        addToPending(client, payment, 3);
        await updatePaymentStatus(payment, 3);
      } else if (
        currentDay === sixDaysAfter &&
        !payment.sentMessages.includes(6)
      ) {
        addToPending(client, payment, 6);
        await updatePaymentStatus(payment, 6);
      } else if (
        currentDay === nineDaysAfter &&
        !payment.sentMessages.includes(9)
      ) {
        addToPending(client, payment, 9);
        await updatePaymentStatus(payment, 9);
      }
    }
  } catch (error) {
    console.error("Error en checkPaymentsAndSendMessages:", error);
  }
};

const addToPending = async (
  client: { id: string; name: string; phone: string; plate: string },
  payment: { id: string },
  number: number
) => {
  // Buscar el mensaje según el daysToSend
  const message = await db.messages.findFirst({
    where: { daysToSend: number },
  });

  if (number === 9) {
    await db.clients.update({
      where: { id: client.id },
      data: {
        status: "V",
      },
    });
  }

  if (!message) return;

  // Reemplazar las variables en el mensaje
  let finalMessage = message.description
    .replace(/{nombre}/g, client.name)
    .replace(/{placa}/g, client.plate)
    .replace(/{telefono}/g, ENV.NUMBER_ADMIN || "");

  await addPendingMessage(client, payment, finalMessage);
};

const addPendingMessage = async (
  client: { name: string; phone: string; plate: string },
  payment: { id: string },
  message: string
) => {
  await db.pending_messages.create({
    data: {
      name: client.name,
      phone: client.phone,
      plate: client.plate,
      paymentId: payment.id,
      message: message,
    },
  });
};

const updatePaymentStatus = async (payment: payments, number: number) => {
  await db.payments.update({
    where: { id: payment.id },
    data: { sentMessages: [...payment.sentMessages, number] },
  });
};

export const processNextClient = async () => {
  const pendingMessage = await db.pending_messages.findFirst({
    where: { processed: false },
    orderBy: { createdAt: "asc" },
  });

  if (!pendingMessage) return;

  //Envio de mensaje
  console.log(`Procesando cliente: ${pendingMessage.name}`);
  console.log(`Mensaje: ${pendingMessage.message}`);

  // Marcar como procesado
  await db.pending_messages.update({
    where: { id: pendingMessage.id },
    data: { processed: true },
  });
};
