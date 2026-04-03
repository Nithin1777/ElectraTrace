require("dotenv").config();
const mysql = require("mysql2/promise");

async function run() {
  const config = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "ElectraTrace",
  };

  const safeConfig = {
    ...config,
    password: config.password ? "***set***" : "***empty***",
  };

  console.log("Checking MySQL connection with config:", safeConfig);

  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [dbRows] = await connection.query("SELECT DATABASE() AS db");
    const [versionRows] = await connection.query("SELECT VERSION() AS version");

    console.log("✅ DB connection successful");
    console.log("Connected database:", dbRows[0]?.db);
    console.log("MySQL version:", versionRows[0]?.version);
    process.exit(0);
  } catch (error) {
    console.error("❌ DB connection failed");
    console.error("Error code:", error.code || "UNKNOWN");
    console.error("Message:", error.message);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\nLikely causes:");
      console.error("- Wrong DB_USER or DB_PASSWORD in backend/.env");
      console.error(
        "- MySQL root account does not allow password auth for localhost",
      );
      console.error(
        "- Root auth plugin mismatch (auth_socket vs mysql_native_password/caching_sha2_password)",
      );
    }

    if (error.code === "ER_BAD_DB_ERROR") {
      console.error("\nDatabase does not exist. Run backend/schema.sql first.");
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
