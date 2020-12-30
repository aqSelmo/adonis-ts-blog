import { Exception } from '@poppinss/utils';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, 404);
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).json({
      statusCode: 404,
      message: this.message,
    });
  }
}
