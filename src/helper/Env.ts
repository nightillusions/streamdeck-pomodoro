const { NODE_ENV } = process.env;
export const isProduction = NODE_ENV && NODE_ENV === 'production';
export const isDev = !isProduction;
