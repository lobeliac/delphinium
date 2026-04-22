import { injectable } from "inversify";
import bcrypt from "bcrypt";

@injectable()
export class CryptoService {
  private readonly saltRounds = 10;

  async hashPassword(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
