import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import NotFoundException from 'App/Exceptions/NotFoundException';

import { rules, schema } from '@ioc:Adonis/Core/Validator';

import User from 'App/Models/User';

export default class UsersController {
  public async index(): Promise<User[] | null> {
    const users = await User.all();

    return users;
  }
  public async show({ params }: HttpContextContract): Promise<User> {
    try {
      const { id } = params;

      const user = await User.findOrFail(id);

      return user;
    } catch {
      throw new NotFoundException('User not found, be sure to enter a valid ID field.');
    }
  }
  public async store({ request, response }: HttpContextContract): Promise<User | undefined> {
    try {
      const postsSchema = schema.create({
        name: schema.string(),
        birthday: schema.date(),
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email' }),
        ]),
      });

      await request.validate({
        schema: postsSchema,
        messages: {
          'name.required': 'Campo nome é requerido.',
          'birthday.required': 'Birthday is rquired to sign up.',
          'email.email': 'Campo e-mail inválido.',
          'email.unique': 'E-mail já existente.',
        },
      });

      const { name, birthday, email, password } = request.only([
        'name',
        'birthday',
        'email',
        'password',
      ]);

      const user = await User.create({
        name,
        birthday,
        email,
        password,
      });

      await user.save();

      return user;
    } catch (error) {
      response.status(422).send(error.messages);
    }
  }
  public async update({ request, params }: HttpContextContract): Promise<User> {
    const { id } = params;
    const { name, birthday, email, password } = request.only([
      'name',
      'birthday',
      'email',
      'password',
    ]);

    await User.updateOrCreate({ id }, { name, birthday, email, password });

    const user = await User.findOrFail(id);

    return user;
  }
  public async destroy({ params }: HttpContextContract): Promise<User> {
    const { id } = params;

    const user = await User.findOrFail(id);

    await user.delete();

    return user;
  }
}
