declare module '*.png'
declare module '*.jpg'
declare module '*.webp'
declare module '*.css'
declare module '*.svg' {
	const content: never
	export default content
}