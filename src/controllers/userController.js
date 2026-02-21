import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

export class UserController extends BaseController {
  constructor(userService = container.get('userService')) {
    super(userService);
  }
}

export default new UserController();