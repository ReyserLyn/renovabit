import { createAuthClient } from "better-auth/react";

const authClientRepo = createAuthClient({
	baseURL: "http://localhost:3001",
	basePath: "/api/v1/auth",
});

export { authClientRepo };
