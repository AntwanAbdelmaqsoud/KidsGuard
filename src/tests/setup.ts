// Test environment setup
process.env.NODE_ENV = process.env.NODE_ENV || "test";
// Reduce noisy logging during tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  // restore mock if necessary
  // @ts-ignore
  if (console.error && (console.error as any).mockRestore)
    (console.error as any).mockRestore();
});

// Increase default timeout for CI or slow machines
jest.setTimeout(20000);

// Mock authentication middlewares to avoid JWT checks in unit tests
jest.mock("../middlewares/isAuthenticated", () => ({
  isAuthenticated: (req: any, _res: any, next: any) => {
    // attach a test user to the request
    req.user = { id: "test-user", email: "test@example.com" };
    return next();
  },
}));

jest.mock("../middlewares/isAdmin", () => ({
  isAdmin: (_req: any, _res: any, next: any) => next(),
}));
