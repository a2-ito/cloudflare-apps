export type Env = {
  DB: D1Database;
};

//export const getDB = (env: Env) => {
//  if (!env?.DB) {
//    throw new Error('D1 Database (env.DB) is not defined')
//  }
//  return env.DB
//}

//export const getDB = () => {
//	const db = (getCloudflareContext().env as any).__DB as D1Database
//	return db
//}
