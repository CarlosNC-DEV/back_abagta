import { Request, Response } from "express";
import db from "../db";
import {
  successResponse,
  errorResponse,
} from "../middlewares/response.middleware";
import { addMonths, parse, format } from "date-fns";

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await db.clients.findMany({
      orderBy: {
        name: "asc",
      },
    });

    successResponse(res, "Clientes obtenidos exitosamente", clients);
  } catch (error) {
    errorResponse(res, "Error al obtener clientes");
  }
};

export const getClientsByCategory = async (req: Request, res: Response) => {
  try {
    const { id_category } = req.params;
    const clients = await db.clients.findMany({
      where: { categoryId: id_category },
      include: {
        category: true,
        payments: {
          where: {
            active: true,
          },
        },
      },
    });

    // Transformamos la respuesta para que el pago sea un objeto único en lugar de un array
    const clientsWithPayment = clients.map((client) => {
        const activePayment = client.payments[0] || null;
        
        return {
          ...client,
          activePayment: activePayment ? {
            ...activePayment,
            infoDate: formatDateToNatural(activePayment.dueDate)
          } : null
        };
      });

    successResponse(res, "Clientes obtenidos exitosamente", clientsWithPayment);
  } catch (error) {
    errorResponse(res, "Error al obtener clientes por categoría");
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, phone, plate, date, address, categoryId } = req.body;

    const plateExists = await db.clients.findUnique({
      where: { plate },
    });

    if (plateExists) {
      return errorResponse(res, "La placa ya esta en uso", 400);
    }

    const categoryExists = await db.categories.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return errorResponse(res, "La categoría especificada no existe", 404);
    }

    const client = await db.clients.create({
      data: {
        name,
        phone,
        plate,
        date,
        address,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    // Calcular la fecha de vencimiento del primer pago
    const startDate = parse(date, "dd/MM/yyyy", new Date());
    const dueDate = format(
      addMonths(startDate, categoryExists.duration),
      "dd/MM/yyyy"
    );

    // Crear el primer pago
    await db.payments.create({
      data: {
        dueDate,
        clientId: client.id,
        active: true,
        paid: false,
      },
    });

    successResponse(res, "Cliente creado exitosamente", client);
  } catch (error) {
    errorResponse(res, "Error al crear cliente");
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, plate, date, address, status } = req.body;

    const clientExists = await db.clients.findUnique({
      where: { id },
      include: {
        category: true,
        payments: {
          where: { active: true },
        },
      },
    });

    if (!clientExists) {
      return errorResponse(res, "El cliente no existe", 404);
    }

    // Si se está actualizando la fecha y es diferente a la actual
    if (date && date !== clientExists.date) {
      // Desactivar el pago actual si existe
      if (clientExists.payments.length > 0) {
        await db.payments.updateMany({
          where: {
            clientId: id,
            active: true,
          },
          data: { active: false },
        });
      }
      // Calcular y crear nuevo pago
      const startDate = parse(date, "dd/MM/yyyy", new Date());
      const dueDate = format(
        addMonths(startDate, clientExists.category.duration),
        "dd/MM/yyyy"
      );

      await db.payments.create({
        data: {
          dueDate,
          clientId: id,
          active: true,
          paid: false,
        },
      });
    }

    const client = await db.clients.update({
      where: { id },
      data: {
        name,
        phone,
        plate,
        date,
        address,
        status,
      },
      include: {
        category: true,
      },
    });
    successResponse(res, "Cliente actualizado exitosamente", client);
  } catch (error) {
    errorResponse(res, "Error al actualizar cliente");
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Obtener el cliente y su pago activo actual
    const client = await db.clients.findUnique({
      where: { id },
      include: {
        category: true,
        payments: {
          where: { active: true },
        },
      },
    });

    if (!client) {
      return errorResponse(res, "Cliente no encontrado", 404);
    }

    if (client.payments.length === 0) {
      return errorResponse(
        res,
        "No hay pagos pendientes para este cliente",
        400
      );
    }

    // 2. Calcular la próxima fecha de pago
    const currentPayment = client.payments[0];
    const currentDate = parse(currentPayment.dueDate, "dd/MM/yyyy", new Date());
    const nextDueDate = format(
      addMonths(currentDate, client.category.duration),
      "dd/MM/yyyy"
    );

    // 3. Marcar el pago actual como pagado y no activo
    await db.payments.update({
      where: { id: currentPayment.id },
      data: {
        paid: true,
        active: false,
      },
    });

    // 4. Crear el nuevo pago
    const newPayment = await db.payments.create({
      data: {
        dueDate: nextDueDate,
        clientId: id,
        active: true,
        paid: false,
      },
    });

    // 5. Actualizar el estado del cliente a 'A' si es diferente
    if (client.status !== "A") {
      await db.clients.update({
        where: { id },
        data: {
          status: "A",
        },
      });
    }

    successResponse(res, "Pago procesado exitosamente", {
      previousPayment: currentPayment,
      nextPayment: newPayment,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, "Error al procesar el pago");
  }
};

//UTILS
const formatDateToNatural = (dateStr: string) => {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const [day, month, year] = dateStr.split("/");
  return `${day} de ${months[parseInt(month) - 1]} ${year}`;
};
