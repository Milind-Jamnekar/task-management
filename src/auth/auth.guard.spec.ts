import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const mockJwtService = {} as JwtService;
    const mockConfigService = {} as ConfigService;
    expect(new AuthGuard(mockJwtService, mockConfigService)).toBeDefined();
  });
});
