require('dotenv').config();

describe('env variables test', () => {
  test("should contain required env variables", () => {
    expect(process.env.FTP_HOST).toBeDefined();

    expect(process.env.FTP_PORT).toBeDefined();

    expect(process.env.FTP_USER).toBeDefined();

    expect(process.env.FTP_PASSWORD).toBeDefined();

    expect(process.env.LOCALHOST).toBeDefined();
  });
});