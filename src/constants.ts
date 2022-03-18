export let PORT = process.env.PORT || 3000;

export let isProd = process.env.NODE_ENV === 'production'

export let SECRET = process.env.SECRET || "a_great_secret" as string;