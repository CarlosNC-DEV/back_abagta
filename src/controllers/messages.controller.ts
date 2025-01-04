import { Request, Response } from "express";
import db from "../db";
import {
  successResponse,
  errorResponse,
} from "../middlewares/response.middleware";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await db.messages.findMany({
      orderBy: {
        order: "asc",
      },
    });

    const messagesWithDayInfo = messages.map((message) => {
      let dayInfo = "";
      if (message.daysToSend < 0) {
        dayInfo = `${Math.abs(message.daysToSend)} días antes`;
      } else if (message.daysToSend === 0) {
        dayInfo = "Día base";
      } else {
        dayInfo = `${message.daysToSend} días después`;
      }

      return {
        ...message,
        dayInfo,
      };
    });

    successResponse(
      res,
      "Mensajes obtenidos exitosamente",
      messagesWithDayInfo
    );
  } catch (error) {
    errorResponse(res, "Error al obtener mensajes");
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { description, order, daysToSend } = req.body;

    const orderIsUnique = await db.messages.findFirst({
      where: {
        order,
      },
    });

    if (orderIsUnique) {
      return errorResponse(res, "El orden ya existe");
    }

    const message = await db.messages.create({
      data: { description, order, daysToSend },
    });
    successResponse(res, "Mensaje creado exitosamente", message);
  } catch (error) {
    errorResponse(res, "Error al crear mensaje");
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const message = await db.messages.update({
      where: { id },
      data: { description },
    });
    successResponse(res, "Mensaje actualizado exitosamente", message);
  } catch (error) {
    errorResponse(res, "Error al actualizar mensaje");
  }
};
