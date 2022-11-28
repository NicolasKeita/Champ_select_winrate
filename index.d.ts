//TODO: why eslint highlight 'module' as an error?
declare module '*.png'
declare module '*.jpg'
declare module '*.webp'
declare module '*.svg' {
	const content: any
	export default content
}
