
export function joinServerAndPath(path: string):string{
    const server = import.meta.env.VITE_SERVER
    return `${server}/${path}`
}