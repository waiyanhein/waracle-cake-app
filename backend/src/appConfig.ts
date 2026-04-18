type AppConfig = {
    env: string,
    database: {
        url: string;
    },
    storage: {
        directory: string;
    }
}

export const appConfig: AppConfig = {
    env: process.env.NODE_ENV!,
    database: {
        url: process.env.DATABASE_URL!,
    },
    storage: {
        directory: process.env.STORAGE_DIRECTORY!,
    }
}