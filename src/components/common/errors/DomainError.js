export class DomainError extends Error {
  constructor(message, name = "DomainError") {
    super(message);
    this.name = name;
  }
}

export class MovieNotFoundError extends DomainError {
  constructor(id) {
    super(`ID ${id}에 해당하는 영화를 찾을 수 없습니다.`, "MovieNotFoundError");
  }
}

export class InvalidInputError extends DomainError {
  constructor(message) {
    super(message || "입력값이 유효하지 않습니다.", "InvalidInputError");
  }
}

export class RepositoryError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "RepositoryError";
    this.originalError = originalError; // 원본 오류 저장
  }
}
