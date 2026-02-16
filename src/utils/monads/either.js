export class Either {
  constructor(value) {
    this.value = value;
  }

  static right(value) {
    return new Right(value);
  }

  static left(value) {
    return new Left(value);
  }

  isRight() {
    return false;
  }

  isLeft() {
    return false;
  }

  map(fn) {
    return this.isRight() ? Either.right(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.isRight() ? fn(this.value) : this;
  }

  getOrElse(defaultValue) {
    return this.isRight() ? this.value : defaultValue;
  }

  getOrThrow() {
    if (this.isLeft()) {
      throw this.value;
    }
    return this.value;
  }

  fold(leftFn, rightFn) {
    return this.isLeft() ? leftFn(this.value) : rightFn(this.value);
  }
}

export class Right extends Either {
  isRight() {
    return true;
  }
}

export class Left extends Either {
  isLeft() {
    return true;
  }
}

export const tryCatch = (fn) => {
  try {
    return Either.right(fn());
  } catch (error) {
    return Either.left(error);
  }
};

export const tryCatchAsync = async (fn) => {
  try {
    const result = await fn();
    return Either.right(result);
  } catch (error) {
    return Either.left(error);
  }
};