import { BaseValidator } from "../services/base/baseValidator.js";
import { ValidationError } from "../utils/errors/domainErrors.js";

export class UserValidator extends BaseValidator {
  async validate(data) {
    await super.validate(data);

    if (!data.username) {
      throw new ValidationError("El username es requerido");
    }

    if (!data.email) {
      throw new ValidationError("El email es requerido");
    }

    if (!data.password) {
      throw new ValidationError("La contraseña es requerida");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(data.email) || data.email.includes("..")) {
      throw new ValidationError("El email no tiene un formato válido");
    }

    if (data.password.length < 6) {
      throw new ValidationError(
        "La contraseña debe tener al menos 6 caracteres",
      );
    }

    return true;
  }
}
