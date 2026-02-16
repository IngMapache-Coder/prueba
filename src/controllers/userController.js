import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

class UserController extends BaseController {
  constructor() {
    super(container.get('userService'));
  }
}

export default new UserController();