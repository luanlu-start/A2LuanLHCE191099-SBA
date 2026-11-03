# A2LuanLHCE191099-SBA

SBA301 assignment with a Spring Boot REST API, React/Vite frontend, and SQL Server database script.

## Run locally

1. Create the SQL Server database using `database.sql`.
2. Set `DB_USERNAME` and `DB_PASSWORD`, or create `A2LuanLH_SE1910_BE/src/main/resources/application-local.properties` with `spring.datasource.username` and `spring.datasource.password`. The local file is ignored by Git.
3. Start the backend from the repository root with `mvn -pl A2LuanLH_SE1910_BE spring-boot:run` (Java 21). The API runs on port 8080.
4. In `A2LuanLH_SE1910_FE`, run `npm install` and `npm run dev`. The frontend runs on port 5173.

The frontend connects to `http://localhost:8080/api`.
